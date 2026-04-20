import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";
import homeData from "../../../../content/home.json";
import styles from "./page.module.scss";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ofmanas.com";

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteUrl}/blogs/${slug}`,
      images: [
        {
          url: "/images/bg_hero.png", // Fallback to hero image if post has none
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ofmanas.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: homeData.landing.name,
      url: siteUrl,
    },
    image: `${siteUrl}/images/bg_hero.png`,
    url: `${siteUrl}/blogs/${slug}`,
    publisher: {
      "@type": "Person",
      name: homeData.landing.name,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Back to blogs">
          <Link href="/blogs" className={styles.backLink}>
            <span className={styles.backArrow}>←</span> All posts
          </Link>
        </nav>

        <article className={styles.article} itemScope itemType="https://schema.org/BlogPosting">
          <header className={styles.header}>
            <div className={styles.meta}>
              <time className={styles.date} dateTime={post.date} itemProp="datePublished">
                {formatDate(post.date)}
              </time>
              {post.readTime && (
                <span className={styles.readTime}>{post.readTime}</span>
              )}
            </div>
            <h1 className={styles.title} itemProp="headline">{post.title}</h1>
            <p className={styles.description} itemProp="description">{post.description}</p>
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <meta itemProp="author" content={homeData.landing.name} />
          </header>

          <div className={styles.content} itemProp="articleBody">
            <MDXRemote source={post.content} />
          </div>
        </article>

        <footer className={styles.footer} aria-label="Post navigation">
          <Link href="/blogs" className={styles.backLink}>
            <span className={styles.backArrow}>←</span> Back to all posts
          </Link>
        </footer>

        <hr className={styles.rule} />

        <footer className={styles.siteFooter} aria-label="Site footer">
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
