import React from 'react';
import styles from './style.module.scss';
import { ResidentState, ResidentMood, FacingDirection } from '../../lib/assistant/assistant-types';

interface CharacterRendererProps {
  state: ResidentState;
  mood: ResidentMood;
  facing: FacingDirection;
  onClick: () => void;
  onMouseEnter: () => void;
}

export const CharacterRenderer: React.FC<CharacterRendererProps> = ({ state, mood, facing, onClick, onMouseEnter }) => {
  const containerClasses = [
    styles.characterRenderer,
    styles[`state-${state}`],
    styles[`mood-${mood}`],
    styles[`facing-${facing}`]
  ].join(' ');

  return (
    <div 
      className={containerClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      role="button"
      tabIndex={0}
      aria-label="Interact with Nino"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <svg 
        className={styles.creatureSvg} 
        viewBox="0 0 64 64" 
        fill="none" 
        stroke="var(--nino-stroke)" 
        strokeWidth="2.5"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Ground shadow - Anchored to floor */}
        <ellipse className={styles.shadow} cx="32" cy="58" rx="14" ry="3" fill="var(--border)" stroke="none" />
        
        {/* Physical Rig Center (Squash/Stretch) */}
        <g className={styles.rigCenter}>
          
          {/* Feet */}
          <g className={styles.feet}>
            <path className={styles.footLeft} d="M26 52 L24 58" />
            <path className={styles.footRight} d="M38 52 L40 58" />
          </g>
          
          {/* Main Body with rotation/bob */}
          <g className={styles.bodyGroup}>
            {/* The Silhouette */}
            <path className={styles.bodyShape} d="M18 32 C18 12, 46 12, 46 32 C46 52, 38 55, 32 55 C26 55, 18 52, 18 32 Z" fill="var(--nino-body)" />
            
            {/* Accessory/Antenna */}
            <g className={styles.antennaGroup}>
              <path className={styles.antennaStem} d="M32 15 L32 7" stroke="var(--nino-accent)" />
              <circle className={styles.antennaTip} cx="32" cy="5" r="3.5" fill="var(--nino-accent)" stroke="none" />
            </g>

            {/* Face (Independent translation for looking around) */}
            <g className={styles.face}>
              {/* Left Eye */}
              <g className={styles.eyeLeftGroup}>
                <circle cx="23" cy="28" r="5.5" fill="var(--nino-eye-bg)" />
                <circle className={styles.pupil} cx="23" cy="28" r="2.2" fill="var(--nino-stroke)" stroke="none" />
                <path className={styles.eyelid} d="M17 28 Q 23 21 29 28" stroke="var(--nino-body)" strokeWidth="6" opacity="0" />
              </g>
              {/* Right Eye */}
              <g className={styles.eyeRightGroup}>
                <circle cx="41" cy="28" r="5.5" fill="var(--nino-eye-bg)" />
                <circle className={styles.pupil} cx="41" cy="28" r="2.2" fill="var(--nino-stroke)" stroke="none" />
                <path className={styles.eyelid} d="M35 28 Q 41 21 47 28" stroke="var(--nino-body)" strokeWidth="6" opacity="0" />
              </g>
              
              {/* Mouth */}
              <g className={styles.mouthGroup}>
                <path className={styles.mouthNeutral} d="M30 36 L34 36" />
                <path className={styles.mouthHappy} d="M29 35 Q 32 39 35 35" opacity="0" />
                <circle className={styles.mouthSurprised} cx="32" cy="37" r="2" opacity="0" />
                <path className={styles.mouthConfused} d="M29 37 L35 35" opacity="0" />
                <path className={styles.mouthThinking} d="M30 37 L32 37" opacity="0" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
