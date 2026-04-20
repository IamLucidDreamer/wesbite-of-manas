import styles from "./style.module.scss";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { slideUp, opacity } from "./animation";
import Rounded from "../../common/RoundedButton";
import homeData from "../../../content/home.json";

export default function Description() {
  const phrase = homeData.description.headline;
  const description = useRef<HTMLDivElement>(null);
  const isInView = useInView(description as React.RefObject<Element>);

  return (
    <div ref={description} className={styles.description}>
      <div className={styles.sectionHeader}>
        <span className={styles.label}>01 About</span>
        <div className={styles.line} />
      </div>

      <div className={styles.body}>
        <div className={styles.left}>
          <p>
            {phrase.split(" ").map((word, index) => (
              <span key={index} className={styles.mask}>
                <motion.span
                  variants={slideUp}
                  custom={index}
                  animate={isInView ? "open" : "closed"}
                  key={index}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>
        </div>

        <div className={styles.right}>
          <motion.p variants={opacity} animate={isInView ? "open" : "closed"}>
            {homeData.description.subtext}
          </motion.p>
          <div data-scroll data-scroll-speed={0.1}>
            <Rounded className={styles.button}>
              <p>About me</p>
            </Rounded>
          </div>
        </div>
      </div>
    </div>
  );
}
