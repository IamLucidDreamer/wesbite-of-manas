import styles from "./style.module.scss";
import { Reveal } from "@/components/Reveal";
import homeData from "../../../content/home.json";

export default function Hero() {
  return (
    <section id="home" className={styles.hero} aria-label="Introduction">
      <div className={styles.heroLeft}>
        <Reveal className={styles.heroEyebrow}>
          SOFTWARE ENGINEER · BUILDER · WRITER
        </Reveal>
        <Reveal as="h1" className={styles.heroHeadline}>
          I care about
          <br />
          how things{" "}
          <span className={styles.heroHeadlineHighlight}>work</span>.
        </Reveal>
        <Reveal as="p" className={styles.heroIntro}>
          I'm {homeData.landing.name}, a software engineer interested in
          systems, developer tools, and the craft of building software.
        </Reveal>
      </div>
      <div className={styles.heroRight}>
        <div className={styles.heroGrid}>
          <Reveal
            as="img"
            type="image"
            src="/images/ionic_founding_team.jpg"
            alt="Engineering project preview 1"
            className={styles.gridImage}
          />
          <Reveal
            as="img"
            type="image"
            src="/images/unacademy_scenes_team.jpg"
            alt="Engineering project preview 2"
            className={styles.gridImage}
          />
          <Reveal
            as="img"
            type="image"
            src="/images/drone_core_team.jpg"
            alt="Engineering project preview 3"
            className={styles.gridImage}
          />
          <Reveal
            as="img"
            type="image"
            src="/images/linedIn_office.png"
            alt="Engineering project preview 4"
            className={styles.gridImage}
          />
        </div>
      </div>
    </section>
  );
}
