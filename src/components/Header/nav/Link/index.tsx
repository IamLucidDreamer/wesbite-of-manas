import styles from './style.module.scss';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { slide, scale } from '../../animation';

export default function Index({data, isActive, setSelectedIndicator} : {
  data: { title: string; href: string; index: number },
  isActive: boolean,
  setSelectedIndicator: (href: string) => void
}) {
  
    const { title, href, index} = data;
  
      const MotionDiv = motion.div as React.FC<any>;

    return (
      <MotionDiv
        className={styles.link} 
        onMouseEnter={() => {setSelectedIndicator(href)}} 
        custom={index} 
        variants={slide} 
        initial="initial" 
        animate="enter" 
        exit="exit"
      >
        <MotionDiv
          variants={scale} 
          animate={isActive ? "open" : "closed"} 
          className={styles.indicator}>
        </MotionDiv>
        <Link href={href}>{title}</Link>
      </MotionDiv>
    )
}