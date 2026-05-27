"use client";

import React, { useEffect, useState, useRef } from 'react';
import styles from './style.module.scss';
import { CharacterRenderer } from './CharacterRenderer';
import { AssistantPanel } from './AssistantPanel';
import { ResidentState, ResidentMood, FacingDirection, AssistantContext } from '../../lib/assistant/assistant-types';
import { contextualMessages, clickReactionsFirstTime, clickReactionsReturn } from '../../lib/assistant/assistant-messages';
import { residentAudio } from '../../lib/assistant/ResidentAudio';
import { usePathname } from 'next/navigation';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = <T,>(arr: T[]) => arr[randomInt(0, arr.length - 1)];

const clickReactions = [...clickReactionsFirstTime, ...clickReactionsReturn];

export default function Assistant() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  
  // Character Core
  const [state, setState] = useState<ResidentState>('idle');
  const [mood, setMood] = useState<ResidentMood>('neutral');
  const [facing, setFacing] = useState<FacingDirection>('left');
  const [speech, setSpeech] = useState<string | null>(null);
  
  // UI State
  const [chatOpen, setChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Physics & Memory Refs (No React State for fast loop variables)
  const posRef = useRef({ x: -100, y: -100 });
  const velRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef<{x: number, y: number} | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, lastMoved: 0 });
  const recentSections = useRef<string[]>([]);
  const recentActions = useRef<string[]>([]);
  const rAF = useRef<number>(0);
  const loopTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Callbacks
  const onArrivalRef = useRef<(() => void) | null>(null);

  // Sync state refs for closures
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  const moodRef = useRef(mood);
  useEffect(() => { moodRef.current = mood; }, [mood]);
  const activeSectionRef = useRef(activeSection);
  useEffect(() => { activeSectionRef.current = activeSection; }, [activeSection]);

  const context: AssistantContext = { page: pathname || '/', section: activeSection };

  // 1. Initial mount, Mouse listener, and Physics Loop
  useEffect(() => {
    setMounted(true);
    
    // Spawn
    const isMobile = window.innerWidth < 768;
    posRef.current = {
      x: window.innerWidth - (isMobile ? 80 : 120),
      y: window.innerHeight - 100
    };
    setVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, lastMoved: Date.now() };
    };
    window.addEventListener('mousemove', onMouseMove);

    // Continuous Physics Loop
    let lastStepTime = 0;
    const updatePhysics = (time: number) => {
      let p = posRef.current;
      let v = velRef.current;
      const t = targetRef.current;
      
      if (t) {
        const dx = t.x - p.x;
        const dy = t.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 3) {
          // Arrived
          velRef.current = { x: 0, y: 0 };
          targetRef.current = null;
          if (onArrivalRef.current) {
            onArrivalRef.current();
            onArrivalRef.current = null;
          }
        } else {
          // Steering
          const isSneaking = stateRef.current === 'sneaking';
          const maxSpeed = isSneaking ? 0.7 : 1.4;
          const accel = isSneaking ? 0.03 : 0.08;
          
          const dirX = dx / dist;
          const dirY = dy / dist;
          
          v.x += dirX * accel;
          v.y += dirY * accel;
          
          // Easing deceleration when close
          const speedLimit = dist < 40 ? maxSpeed * (dist / 40) : maxSpeed;
          const currentSpeed = Math.sqrt(v.x*v.x + v.y*v.y);
          if (currentSpeed > speedLimit) {
            v.x = (v.x / currentSpeed) * speedLimit;
            v.y = (v.y / currentSpeed) * speedLimit;
          }
          
          // Audio footstep logic
          if (time - lastStepTime > (isSneaking ? 600 : 350)) {
             residentAudio.playStep();
             lastStepTime = time;
          }
        }
      } else {
        // Friction when stopping
        v.x *= 0.85;
        v.y *= 0.85;
        if (Math.abs(v.x) < 0.1) v.x = 0;
        if (Math.abs(v.y) < 0.1) v.y = 0;
      }
      
      p.x += v.x;
      p.y += v.y;
      
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }
      
      rAF.current = requestAnimationFrame(updatePhysics);
    };
    rAF.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, []);

  // 2. Global Chat listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && chatOpen) {
        setChatOpen(false);
        setState('idle');
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (chatOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setChatOpen(false);
        setState('idle');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [chatOpen]);

  // 3. Track active section
  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let bestMatch = activeSectionRef.current;
        let maxRatio = 0;
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestMatch = entry.target.id || entry.target.tagName.toLowerCase();
          }
        });
        if (bestMatch && bestMatch !== activeSectionRef.current) {
          setActiveSection(bestMatch);
        }
      },
      { threshold: [0.1, 0.5, 0.8] }
    );
    setTimeout(() => {
      const elements = [
        document.getElementById('home'),
        document.getElementById('blogs'),
        document.querySelector('footer')
      ].filter(Boolean) as Element[];
      elements.forEach(el => observer.observe(el));
    }, 500);
    return () => observer.disconnect();
  }, [mounted]);

  // 4. Behavioral Brain Loop
  useEffect(() => {
    if (!visible || chatOpen) return;

    const getSectionEdge = (targetId: string) => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return { x: randomInt(30, window.innerWidth - 80), y: window.innerHeight - 100 };
      
      const el = document.getElementById(targetId) || (targetId === 'footer' ? document.querySelector('footer') : null);
      if (!el) return { x: randomInt(100, window.innerWidth - 100), y: window.innerHeight - 100 };
      
      const rect = el.getBoundingClientRect();
      // Pick a random edge along the section
      const targetX = Math.max(60, Math.min(window.innerWidth - 100, randomInt(rect.left + 50, rect.right - 100)));
      // Hang out near the bottom edge
      const targetY = Math.max(60, Math.min(window.innerHeight - 80, rect.bottom - 40));
      return { x: targetX, y: targetY };
    };

    const getMouseApproachTarget = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      // Approach to a safe distance (100px away)
      const offset = randomInt(-100, 100);
      return {
        x: Math.max(40, Math.min(window.innerWidth - 80, mx + (offset > 0 ? 100 : -100))),
        y: Math.max(40, Math.min(window.innerHeight - 80, my + randomInt(-50, 50)))
      };
    };

    const scheduleNext = (minMs: number, maxMs: number) => {
      loopTimeout.current = setTimeout(brainLoop, randomInt(minMs, maxMs));
    };

    const brainLoop = () => {
      if (stateRef.current === 'chatting' || stateRef.current === 'speaking') {
        scheduleNext(5000, 8000);
        return;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const px = posRef.current.x;
      const py = posRef.current.y;
      const distToMouse = Math.sqrt(Math.pow(mx - px, 2) + Math.pow(my - py, 2));
      const mouseIdleTime = Date.now() - mouseRef.current.lastMoved;

      // Behavior weights
      let weights = {
        idle: 40,
        wander: 15,
        sneak: 10,
        mouse_aware: 0,
        inspect: 10,
        think: 10,
        rest: 5,
        wiggle: 2
      };

      // Environmental modifiers
      if (distToMouse < 400 && mouseIdleTime < 2000) {
        weights.mouse_aware = 30; // Mouse is near and active
      }
      if (moodRef.current === 'sleepy') {
        weights.rest += 40;
        weights.wander = 2;
        weights.sneak = 2;
      }
      
      // Select action
      const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
      let rand = Math.random() * totalWeight;
      let chosenAction = 'idle';
      for (const [action, weight] of Object.entries(weights)) {
        rand -= weight;
        if (rand <= 0) {
          chosenAction = action;
          break;
        }
      }

      recentActions.current = [chosenAction, ...recentActions.current].slice(0, 5);

      // Execute Action Sequence
      if (chosenAction === 'mouse_aware') {
        // Notice mouse
        setState('inspecting');
        setMood('curious');
        setFacing(mx > px ? 'right' : 'left');
        
        setTimeout(() => {
          if (stateRef.current === 'chatting') return;
          // Decide: sneak towards it or ignore?
          if (Math.random() > 0.4 && distToMouse > 150) {
             targetRef.current = getMouseApproachTarget();
             setState('sneaking');
             setFacing(targetRef.current.x > posRef.current.x ? 'right' : 'left');
             onArrivalRef.current = () => {
               setState('reacting');
               setMood('calm');
               setTimeout(() => { setState('idle'); setMood('neutral'); scheduleNext(3000, 6000); }, 500);
             };
          } else {
             // Too close or lazy, just watch
             setState('idle');
             setMood('neutral');
             scheduleNext(2000, 5000);
          }
        }, randomInt(800, 1500));
        
      } else if (chosenAction === 'wander' || chosenAction === 'sneak') {
        // Look before moving
        const targetSection = pickRandom(['home', 'blogs', 'footer']);
        targetRef.current = getSectionEdge(targetSection);
        const movingRight = targetRef.current.x > px;
        
        // 1. Orient
        setState('inspecting');
        setMood(chosenAction === 'sneak' ? 'curious' : 'calm');
        setFacing(movingRight ? 'right' : 'left');
        
        // 2. Move
        setTimeout(() => {
          if (stateRef.current === 'chatting') { targetRef.current = null; return; }
          setState(chosenAction === 'sneak' ? 'sneaking' : 'walking');
          
          // 3. Arrive
          onArrivalRef.current = () => {
            setState('reacting'); // small momentum squash
            setMood('calm');
            setTimeout(() => {
               setState('idle');
               setMood('neutral');
               scheduleNext(5000, 10000);
            }, 600);
          };
        }, randomInt(600, 1200));

      } else if (chosenAction === 'inspect') {
        setState('inspecting');
        setMood('curious');
        setFacing(pickRandom(['left', 'right']));
        setTimeout(() => { setState('idle'); setMood('neutral'); scheduleNext(4000, 8000); }, randomInt(2000, 4000));
      } else if (chosenAction === 'think') {
        setState('thinking');
        setMood('curious');
        setTimeout(() => { setState('idle'); setMood('neutral'); scheduleNext(4000, 8000); }, randomInt(2000, 4000));
      } else if (chosenAction === 'rest') {
        setState('resting');
        setMood('sleepy');
        scheduleNext(12000, 20000);
      } else if (chosenAction === 'wiggle') {
        setState('wiggling');
        setMood('playful');
        setTimeout(() => { setState('idle'); setMood('neutral'); scheduleNext(5000, 8000); }, 600);
      } else {
        // IDLE
        setState('idle');
        if (Math.random() > 0.5) setMood('neutral');
        scheduleNext(4000, 8000);
      }
    };

    scheduleNext(2000, 5000);
    return () => { if (loopTimeout.current) clearTimeout(loopTimeout.current); };
  }, [visible, chatOpen]);

  // 5. Explicit Interactions
  const handleInteraction = () => {
    residentAudio.init();
    if (chatOpen) {
      setChatOpen(false);
      setState('idle');
      return;
    }
    targetRef.current = null; // Stop moving instantly
    velRef.current = {x: 0, y: 0};
    
    setState('startled');
    setMood('surprised');
    residentAudio.playCurious();
    
    setTimeout(() => {
      setSpeech(pickRandom(clickReactions));
      setState('speaking');
      setMood('excited');
      residentAudio.playPop();
      
      setTimeout(() => {
        setSpeech(null);
        setState('chatting');
        setMood('calm');
        setChatOpen(true);
      }, 1500);
      
    }, 800);
  };

  const handleHover = () => {
    if (Math.random() < 0.4 && state !== 'chatting' && state !== 'reacting' && state !== 'startled') {
      targetRef.current = null; // Stop
      velRef.current = {x: 0, y: 0};
      
      setState('startled');
      setMood('shy');
      setFacing(posRef.current.x > window.innerWidth / 2 ? 'left' : 'right');
      setTimeout(() => {
        if (stateRef.current !== 'chatting') {
           setState('idle');
           setMood('neutral');
        }
      }, 1000);
    }
  };

  if (!mounted) return null;

  return (
    <div 
      className={`${styles.assistantContainer} ${chatOpen ? styles.panelOpen : ''}`}
      style={{ opacity: visible ? 1 : 0 }}
      ref={containerRef}
    >
      <div className={`${styles.speechBubble} ${speech ? styles.isSpeaking : ''}`} aria-live="polite">
        {speech}
      </div>
      
      <CharacterRenderer 
        state={state} 
        mood={mood} 
        facing={facing} 
        onClick={handleInteraction} 
        onMouseEnter={handleHover}
      />

      <AssistantPanel 
        onClose={() => {
          setChatOpen(false);
          setSpeech("okay, I'm going.");
          setState('speaking');
          setTimeout(() => {
            setSpeech(null);
            setState('stretching');
            setMood('calm');
            setTimeout(() => { setState('idle'); setMood('neutral'); }, 1500);
          }, 1500);
        }} 
        context={context} 
      />
    </div>
  );
}
