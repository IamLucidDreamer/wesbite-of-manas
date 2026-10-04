import styles from "./style.module.scss";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

interface Post {
  slug: string;
  title: string;
  tags?: string[];
}

interface WritingProps {
  posts: Post[];
}

export default function Writing({ posts }: WritingProps) {
  return (
    <section
      id="blogs"
      className={styles.writingSection}
      aria-label="Latest blog posts"
    >
      <div className={styles.writingLeft}>
        <Reveal as="h2" className={styles.writingLabel}>
          WRITING
        </Reveal>
        <Reveal as="p" className={styles.writingDescription}>
          Thoughts on software, systems, and the craft of building things.
        </Reveal>
      </div>
      <div className={styles.writingRight}>
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
                <Reveal
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <span className={styles.postTitle} itemProp="name">
                    {post.title}
                  </span>
                  <div className={styles.postMetaGroup}>
                    {post.tags && post.tags.length > 0 && (
                      <span
                        className={styles.postCategory}
                        data-category={post.tags[0].toLowerCase()}
                      >
                        {post.tags[0]}
                      </span>
                    )}
                  </div>
                  <meta itemProp="url" content={`/blogs/${post.slug}`} />
                </Reveal>
              </Link>
            ))}
          </div>
        )}
        <Link href="/blogs" className={styles.allPosts}>
          <Reveal as="span">VIEW ALL →</Reveal>
        </Link>
      </div>
    </section>
  );
}
