"use client";
import React from "react";
import styles from "./style.module.scss";

export default function index({
  index,
  title,
  manageModal,
}: {
  index: number;
  title: string;
  manageModal: (isOpen: boolean, index: number, x: number, y: number) => void;
}) {
  return (
    <div
      onMouseEnter={(e) => {
        manageModal(true, index, e.clientX, e.clientY);
      }}
      onMouseLeave={(e) => {
        manageModal(false, index, e.clientX, e.clientY);
      }}
      className={styles.project}
    >
      <h2>{title}</h2>
      <p>Design & Development</p>
    </div>
  );
}
