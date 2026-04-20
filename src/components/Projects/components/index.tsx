"use client";
import React from "react";
import styles from "./style.module.scss";

export default function Project({
  index,
  title,
  company,
  manageModal,
  link,
}: {
  index: number;
  title: string;
  company: string;
  manageModal: (isOpen: boolean, index: number, x: number, y: number) => void;
  link: string;
}) {
  return (
    <div
      onClick={() => window.open(link, "_blank")}
      onMouseEnter={(e) => manageModal(true, index, e.clientX, e.clientY)}
      onMouseLeave={(e) => manageModal(false, index, e.clientX, e.clientY)}
      className={styles.project}
    >
      <span className={styles.index}>0{index + 1}</span>
      <span className={styles.company}>{company}</span>
      <span className={styles.role}>{title}</span>
      <span className={styles.arrow}>↗</span>
    </div>
  );
}
