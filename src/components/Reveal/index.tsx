"use client";

import React, { useEffect, useRef } from "react";
import styles from "./reveal.module.scss";

// --- Global Observer Logic ---
let observer: IntersectionObserver | null = null;
let intersectQueue: HTMLElement[] = [];
let queueTimeout: NodeJS.Timeout | null = null;

const handleIntersect = (entries: IntersectionObserverEntry[]) => {
  const newIntersects = entries
    .filter((e) => e.isIntersecting)
    .map((e) => e.target as HTMLElement);

  if (newIntersects.length === 0) return;

  newIntersects.forEach((el) => {
    intersectQueue.push(el);
    if (observer) observer.unobserve(el);
  });

  if (!queueTimeout) {
    queueTimeout = setTimeout(() => {
      // Sort elements by vertical position primarily
      intersectQueue.sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        // If they are roughly on the same line (e.g. grid items), sort horizontally
        if (Math.abs(aRect.top - bRect.top) < 24) {
          return aRect.left - bRect.left;
        }
        return aRect.top - bRect.top;
      });

      // Apply staggering
      intersectQueue.forEach((el, index) => {
        const staggerAmount = 50; // 50ms between elements
        const maxDelay = 350; // Cap delay so scrolling doesn't feel sluggish
        
        // Wait for a very small moment before starting
        const baseDelay = 40; 
        
        const delay = baseDelay + Math.min(index * staggerAmount, maxDelay);
        
        el.style.transitionDelay = `${delay}ms`;
        el.style.animationDelay = `${delay}ms`; // Added for keyframe animations
        
        // Double requestAnimationFrame ensures the DOM has updated the inline delay
        // before we set the data-revealed attribute to trigger the transition
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.dataset.revealed = "true";
          });
        });
      });

      intersectQueue = [];
      queueTimeout = null;
    }, 30);
  }
};

const getObserver = () => {
  if (typeof window === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px 0px -40px 0px", // Trigger when slightly inside viewport
      threshold: 0,
    });
  }
  return observer;
};

// --- Components ---

interface RevealProps extends Omit<React.HTMLProps<any>, "as"> {
  children?: React.ReactNode;
  className?: string;
  type?: "text" | "image";
  as?: React.ElementType;
  style?: React.CSSProperties;
}

export function Reveal({ 
  children, 
  className = "", 
  type = "text", 
  as: Component = "div",
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset state in case it was rendered previously
    el.dataset.revealed = "false";
    el.style.transitionDelay = "0ms";
    el.style.animationDelay = "0ms";

    const obs = getObserver();
    if (obs) {
      obs.observe(el);
    }

    return () => {
      if (obs && el) {
        obs.unobserve(el);
      }
    };
  }, []);

  const revealClass = type === "image" ? styles.revealImage : styles.revealText;
  const combinedClassName = `${revealClass} ${className}`.trim();

  return (
    <Component ref={ref} className={combinedClassName} data-revealed="false" style={style} {...props}>
      {children}
    </Component>
  );
}

