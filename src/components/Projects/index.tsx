"use client";
import styles from "./style.module.scss";
import { useState, useEffect, useRef } from "react";
import Project from "./components/";
import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import Rounded from "../../common/RoundedButton";
import homeData from "../../../content/home.json";

const projects = homeData.experiences;

const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
};

export default function Home() {
  const [modal, setModal] = useState({ active: false, index: 0 });
  const { active, index } = modal;
  const modalContainer = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line
  const MotionDiv = motion.div as React.FC<any>;

  const xMoveContainer = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yMoveContainer = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const xMoveCursor = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yMoveCursor = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const xMoveCursorLabel = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yMoveCursorLabel = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!modalContainer.current || !cursor.current || !cursorLabel.current)
      return;

    xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", {
      duration: 0.8,
      ease: "power3",
    });
    yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", {
      duration: 0.8,
      ease: "power3",
    });
    xMoveCursor.current = gsap.quickTo(cursor.current, "left", {
      duration: 0.5,
      ease: "power3",
    });
    yMoveCursor.current = gsap.quickTo(cursor.current, "top", {
      duration: 0.5,
      ease: "power3",
    });
    xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", {
      duration: 0.45,
      ease: "power3",
    });
    yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", {
      duration: 0.45,
      ease: "power3",
    });
  }, []);

  const moveItems = (x: number, y: number) => {
    xMoveContainer.current?.(x);
    yMoveContainer.current?.(y);
    xMoveCursor.current?.(x);
    yMoveCursor.current?.(y);
    xMoveCursorLabel.current?.(x);
    yMoveCursorLabel.current?.(y);
  };

  const manageModal = (
    active: boolean,
    index: number,
    x: number,
    y: number,
  ) => {
    moveItems(x, y);
    setModal({ active, index });
  };

  return (
    <main
      onMouseMove={(e) => moveItems(e.clientX, e.clientY)}
      className={styles.projects}
    >
      <div className={styles.sectionHeader}>
        <span className={styles.label}>02 Experience</span>
        <div className={styles.line} />
      </div>

      <div className={styles.body}>
        {projects.map((project, index) => (
          <Project
            key={index + project.link}
            index={index}
            title={project.title}
            company={project.company}
            manageModal={manageModal}
            link={project.link}
          />
        ))}
      </div>

      <Rounded onClick={() => window.open(homeData.contact.resume, "_blank")}>
        <p>View Resume</p>
      </Rounded>

      <>
        <MotionDiv
          ref={modalContainer}
          variants={scaleAnimation}
          initial="initial"
          animate={active ? "enter" : "closed"}
          className={styles.modalContainer}
        >
          <div
            style={{ top: index * -100 + "%" }}
            className={styles.modalSlider}
          >
            {projects.map((project, index) => (
              <div
                key={`modal_${index}`}
                className={styles.modal}
                style={{ backgroundColor: project.color }}
              >
                <Image
                  src={`/images/${project.src}`}
                  width={380}
                  height={0}
                  alt={project.company}
                />
              </div>
            ))}
          </div>
        </MotionDiv>
        <MotionDiv
          ref={cursor}
          className={styles.cursor}
          variants={scaleAnimation}
          initial="initial"
          animate={active ? "enter" : "closed"}
        />
        <MotionDiv
          ref={cursorLabel}
          className={styles.cursorLabel}
          variants={scaleAnimation}
          initial="initial"
          animate={active ? "enter" : "closed"}
        >
          View
        </MotionDiv>
      </>
    </main>
  );
}
