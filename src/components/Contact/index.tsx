import styles from './style.module.scss';
import Image from 'next/image';
import Rounded from '../../common/RoundedButton';
import { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import Magnetic from '../../common/Magnetic';

export default function Contact() {
    const container = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: container as React.RefObject<HTMLElement>,
        offset: ["start end", "end end"]
    })
    const x = useTransform(scrollYProgress, [0, 1], [0, 100])
    const y = useTransform(scrollYProgress, [0, 1], [-500, 0])
    const rotate = useTransform(scrollYProgress, [0, 1], [120, 90])

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours}:${minutes < 10 ? '0' + minutes : minutes
    } ${hours >= 12 ? 'PM' : 'AM'}`;
    const currentYear = date.getFullYear();

    const handleEmailClick = () => {
        window.location.href = `mailto:shuklamanasofficial@gmail.com`;
    }

    const handlePhoneClick = () => {
        window.location.href = `tel:+919569050543`;
    }

    // eslint-disable-next-line
    const MotionDiv = motion.div as React.FC<any>;
    return (
        <MotionDiv style={{y}} ref={container} className={styles.contact}>
            <div className={styles.body}>
                <div className={styles.title}>
                    <span>
                        <div className={styles.imageContainer}>
                            <Image 
                            fill={true}
                            alt={"image"}
                            src={`/images/hero_bg.png`}
                            />
                        </div>
                        <h2>Let&apos;s work</h2>
                    </span>
                    <h2>together</h2>
                    <MotionDiv style={{x}} className={styles.buttonContainer}>
                        <Rounded  backgroundColor={"#334BD3"} className={styles.button} onClick={handleEmailClick}>
                            <p>Get in touch</p>
                        </Rounded>
                    </MotionDiv>
                    <motion.svg style={{rotate, scale: 2}} width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z" fill="white"/>
                    </motion.svg>
                </div>
                <div className={styles.nav}>
                        <Rounded onClick={handleEmailClick}>
                            <p>shuklamanasofficial@gmail.com</p>
                        </Rounded>
                        <Rounded onClick={handlePhoneClick}>
                            <p>+91 9569050543</p>
                        </Rounded>
                </div>
                <div className={styles.info}>
                    <div>
                        <span>
                            <h3>Version</h3>
                            <p>{currentYear} © Edition</p>
                        </span>
                        <span>
                            <h3>Version</h3>
                            <p>v2025.07.23</p>
                        </span>
                    </div>
                    <div>
                        <span>
                            <h3>socials</h3>
                            <Magnetic>
                                <a href='https://github.com/iamluciddreamer' target='_blank' rel='noopener noreferrer'>Github</a>
                            </Magnetic>
                        </span>
                        <Magnetic>
                            <a href='https://www.linkedin.com/in/shuklamanas007/' target='_blank' rel='noopener noreferrer'>Linkedin</a>
                        </Magnetic>
                    </div>
                </div>
            </div>
        </MotionDiv>
    )
}