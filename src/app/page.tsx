"use client";

import styles from "./page.module.scss";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "../components/Preloader";
import Landing from "../components/Landing";
import Description from "../components/Description";
import Projects from "../components/Projects";
import SlidingImages from "../components/SlidingImages";
import Contact from "../components/Contact";

// Import CSS
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line
    let locoScroll: any;

    const initScroll = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      locoScroll = new LocomotiveScroll({
        el: scrollRef.current!,
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true },
        // eslint-disable-next-line
      } as any);
    };

    const timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
      window.scrollTo(0, 0);
      initScroll();
    }, 2000);

    return () => {
      clearTimeout(timeout);
      if (locoScroll) locoScroll.destroy();
    };
  }, []);

const innerWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  return (
    <main className={styles.main} ref={scrollRef} data-scroll-container>
      <div className={styles.bannerHeader}>
          <h3 className={styles.headerText}>
            Welcome to my updated portfolio! It&apos;s still under development, so you might run into a few quirks — but exciting updates are on the way!
          </h3>
      </div>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>

      <Landing />
      <Description />
      <Projects />
      { innerWidth > 768 &&
      <>
      <SlidingImages />
       <Contact />
      </>
      }
    </main>
  );
}
