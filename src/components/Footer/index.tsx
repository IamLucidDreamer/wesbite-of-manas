import styles from "./style.module.scss";
import { Reveal } from "@/components/Reveal";
import homeData from "../../../content/home.json";

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.footerContact}>
        <div className={styles.footerContactLeft}>
          <Reveal as="h2" className={styles.footerHeading}>
            GET IN TOUCH
          </Reveal>
        </div>
        <div className={styles.footerContactRight}>
          <Reveal as="p" className={styles.footerParagraph}>
            I enjoy building software, thinking through difficult technical problems, and working on products that are useful and well made. If you'd like to talk about an idea, a project, or engineering, say hello.
          </Reveal>
          <Reveal as="div" className={styles.footerLinks}>
            <a href={`mailto:${homeData.contact.email}`} className={styles.footerLink}>EMAIL</a>
            <span className={styles.separator}>·</span>
            <a href={homeData.contact.github} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GITHUB</a>
            <span className={styles.separator}>·</span>
            <a href={homeData.contact.linkedin} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>LINKEDIN</a>
          </Reveal>
        </div>
      </div>

      <hr className={styles.rule} />

      <div className={styles.footerBottom}>
        <div className={styles.ninoStage} aria-hidden="true" />
        
        <div className={styles.footerMetadata}>
          <Reveal as="span">EST. 2021 <span className={styles.separator}>·</span> LAST UPDATED {new Date().getFullYear()}</Reveal>
        </div>
        <div className={styles.footerCopyright}>
          <Reveal as="span">© {new Date().getFullYear()} {homeData.landing.name}.</Reveal>
        </div>
      </div>
    </footer>
  );
}
