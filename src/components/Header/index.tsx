"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "./nav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "../../common/RoundedButton";
import Magnetic from "../../common/Magnetic";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as React.FC<any>;

export default function Header() {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isActive) setIsActive(false);
    // eslint-disable-next-line
  }, [pathname]);

  useLayoutEffect(() => {
    if (window.innerWidth <= 768) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () =>
          gsap.to(button.current, {
            scale: 1,
            duration: 0.25,
            ease: "power1.out",
          }),
        onEnterBack: () => {
          gsap.to(button.current, {
            scale: 0,
            duration: 0.25,
            ease: "power1.out",
          });
          setIsActive(false);
        },
      },
    });
  }, []);

  const close = () => setIsActive(false);

  return (
    <>
      <div ref={header} className={styles.header}>
        <div className={styles.inner}>
          <Magnetic>
            <Link href="/" className={styles.logo}>
              <p className={styles.copyright}>©</p>
              <div className={styles.name}>
                <p className={styles.codeBy}>Code by</p>
                <p className={styles.manas}>Manas</p>
                <p className={styles.shukla}>Shukla</p>
              </div>
            </Link>
          </Magnetic>

          <div className={styles.nav}>
            {[
              { label: "about", href: "/#about" },
              { label: "experience", href: "/#experience" },
              { label: "stack", href: "/#stack" },
              { label: "writing", href: "/#blogs" },
              { label: "contact", href: "/#contact" },
            ].map(({ label, href }) => (
              <Magnetic key={label}>
                <div className={styles.el}>
                  <a href={href}>{label}</a>
                  <div className={styles.indicator} />
                </div>
              </Magnetic>
            ))}

            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div ref={button} className={styles.headerButtonContainer}>
        <Rounded
          onClick={() => setIsActive(!isActive)}
          className={styles.button}
          backgroundColor="var(--bg-2)"
        >
          <div
            className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}
          />
        </Rounded>
      </div>

      {/* Backdrop always mounted, fades in/out */}
      <MotionDiv
        className={styles.backdrop}
        animate={{ opacity: isActive ? 1 : 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ pointerEvents: isActive ? "auto" : "none" }}
        onClick={close}
      />

      <Nav isActive={isActive} onClose={close} />
    </>
  );
}
