import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";
import homeData from "../../../content/home.json";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Thoughts on frontend engineering, animation, and building things for the web.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ofmanas.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/blogs/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.container}>
        <header className={styles.header}>
          <nav aria-label="Breadcrumb">
            <Link href="/" className={styles.backLink}>
              <span className={styles.backArrow}>←</span> Home
            </Link>
          </nav>
          <h1 className={styles.title}>Blogs</h1>
          <p className={styles.subtitle}>
            Thoughts on frontend engineering, animation, and building things for the web.
          </p>
        </header>

        <section aria-label="Blog posts list">
          {posts.length === 0 ? (
            <p className={styles.empty}>No posts yet. Check back soon.</p>
          ) : (
            <ul className={styles.postList} itemScope itemType="https://schema.org/ItemList">
              {posts.map((post) => (
                <li key={post.slug} className={styles.postItem} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link href={`/blogs/${post.slug}`} className={styles.postLink} itemProp="url">
                    <div className={styles.postMeta}>
                      <time className={styles.date} dateTime={post.date}>{formatDate(post.date)}</time>
                      {post.readTime && (
                        <span className={styles.readTime}>{post.readTime}</span>
                      )}
                    </div>
                    <h2 className={styles.postTitle} itemProp="name">{post.title}</h2>
                    <p className={styles.postDescription}>{post.description}</p>
                    <div className={styles.tags}>
                      {post.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className={styles.readMore}>
                      Read post <span className={styles.arrow} aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <hr className={styles.rule} />

        <footer className={styles.footer} aria-label="Site footer">
          <span>© {new Date().getFullYear()} {homeData.landing.name}</span>
          <span>v{homeData.updatedAt}</span>
        </footer>
      </div>
    </main>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
