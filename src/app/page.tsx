import styles from "./page.module.scss";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import homeData from "../../content/home.json";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main className={styles.main}>
      {/* ── Hero ─────────────────────────────── */}
      <section id="home" className={styles.hero} aria-label="Introduction">
        <div className={styles.heroTop}>
          <h1 className={styles.heroName}>{homeData.landing.name}</h1>
          <span className={styles.heroRole}>
            {homeData.landing.role.join(" ")}
          </span>
        </div>
        <p className={styles.heroTagline}>{homeData.description.subtext}</p>
        <p className={styles.heroCurrent}>
          Open to new opportunities · Based in Bengaluru, India
        </p>
      </section>

      <hr className={styles.rule} />

      {/* ── About ────────────────────────────── */}
      <section id="about" className={styles.section} aria-label="About me">
        <span className={styles.label}>about</span>
        <div className={styles.content}>
          <p>{homeData.description.headline}</p>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* ── Experience ───────────────────────── */}
      <section
        id="experience"
        className={styles.section}
        aria-label="Work experience"
      >
        <span className={styles.label}>experience</span>
        <div className={styles.content}>
          {homeData.experiences.map((exp, i) => (
            <a
              key={i}
              href={exp.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.expRow}
              itemScope
              itemType="https://schema.org/Organization"
            >
              <div className={styles.expMain}>
                <span className={styles.expCompany} itemProp="name">
                  {exp.company}
                </span>
                <span className={styles.expPeriod}>{exp.period}</span>
              </div>
              <div className={styles.expSub}>
                <span className={styles.expRole}>{exp.title}</span>
                <span className={styles.expArrow} aria-hidden="true">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <hr className={styles.rule} />

      {/* ── Writing ──────────────────────────── */}
      <section
        id="blogs"
        className={styles.section}
        aria-label="Latest blog posts"
      >
        <span className={styles.label}>writing</span>
        <div className={styles.content}>
          {posts.length === 0 ? (
            <p className={styles.empty}>No posts yet.</p>
          ) : (
            <div
              className={styles.postList}
              itemScope
              itemType="https://schema.org/ItemList"
            >
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blogs/${post.slug}`}
                  className={styles.postRow}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <span className={styles.postTitle} itemProp="name">
                    {post.title}
                  </span>
                  <span className={styles.postDate}>
                    {formatDate(post.date)}
                  </span>
                  <meta itemProp="url" content={`/blogs/${post.slug}`} />
                </Link>
              ))}
            </div>
          )}
          <Link href="/blogs" className={styles.allPosts}>
            All posts →
          </Link>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* ── Technologies ─────────────────────── */}
      <section
        id="technologies"
        className={styles.section}
        aria-label="Tech stack"
      >
        <span className={styles.label}>stack</span>
        <div className={styles.content}>
          <div className={styles.techGrid}>
            {Object.entries(homeData.technologies).map(([category, items]) => (
              <div key={category} className={styles.techCategory}>
                <span className={styles.techLabel}>{category}</span>
                <span className={styles.techItems}>
                  {(items as string[]).join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* ── Contact ──────────────────────────── */}
      <section
        id="contact"
        className={styles.section}
        aria-label="Contact information"
      >
        <span className={styles.label}>contact</span>
        <div className={styles.content}>
          <a
            href={`mailto:${homeData.contact.email}`}
            className={styles.contactRow}
            itemProp="email"
          >
            {homeData.contact.email}
          </a>
          <a
            href={homeData.contact.phone.replace(/\s/g, "tel:")}
            className={styles.contactRow}
            itemProp="telephone"
          >
            {homeData.contact.phone}
          </a>
          <a
            href={homeData.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactRow}
          >
            GitHub ↗
          </a>
          <a
            href={homeData.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactRow}
          >
            LinkedIn ↗
          </a>
          <a
            href={homeData.contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactRow}
          >
            Resume ↗
          </a>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* ── Footer ───────────────────────────── */}
      <footer className={styles.footer} aria-label="Site footer">
        <span>
          © {new Date().getFullYear()} {homeData.landing.name}
        </span>
        <span>v{homeData.updatedAt}</span>
      </footer>
    </main>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}
