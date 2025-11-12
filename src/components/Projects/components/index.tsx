"use client";
import React from "react";
import styles from "./style.module.scss";

export default function Projects({
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
      onClick={() => {
        window.open(link, "_blank");
      }}
      onMouseEnter={(e) => {
        manageModal(true, index, e.clientX, e.clientY);
      }}
      onMouseLeave={(e) => {
        manageModal(false, index, e.clientX, e.clientY);
      }}
      className={styles.project}
    >
      <h2>{company}</h2>
      <p>{title}</p>
    </div>
  );
}
