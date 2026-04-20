import styles from './style.module.scss';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { slide, scale } from '../../animation';

export default function LinkComp({ data, isActive, setSelectedIndicator, onClose }: {
  data: { title: string; href: string; index: number },
  isActive: boolean,
  setSelectedIndicator: (href: string) => void,
  onClose: () => void,
}) {
  const { title, href, index } = data;

  // eslint-disable-next-line
  const MotionDiv = motion.div as React.FC<any>;

  return (
    <MotionDiv
      className={styles.link}
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variants={slide as any}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <MotionDiv variants={scale as any} animate={isActive ? "open" : "closed"} className={styles.indicator} />
      <Link href={href} onClick={onClose}>{title}</Link>
    </MotionDiv>
  );
}
