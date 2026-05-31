import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";
import homeData from "../../../../content/home.json";
import styles from "./page.module.scss";
import { Reveal } from "@/components/Reveal";

const mdxComponents = {
  h1: (props: any) => <Reveal as="h1" {...props} />,
  h2: (props: any) => <Reveal as="h2" {...props} />,
  h3: (props: any) => <Reveal as="h3" {...props} />,
  h4: (props: any) => <Reveal as="h4" {...props} />,
  p: (props: any) => <Reveal as="p" {...props} />,
  ul: (props: any) => <Reveal as="ul" {...props} />,
  ol: (props: any) => <Reveal as="ol" {...props} />,
  blockquote: (props: any) => <Reveal as="blockquote" {...props} />,
  img: (props: any) => <Reveal as="img" type="image" {...props} />,
  hr: (props: any) => <Reveal as="hr" {...props} />,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const post = getPostBySlug(slug);
    
    if (!post) return { title: "Post Not Found" };

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
            url: "/images/bg_hero.png",
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
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return { title: "Error" };
  }
}

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  if (!resolvedParams || !resolvedParams.slug) {
    console.error("Missing slug in params");
    notFound();
  }

  const { slug } = resolvedParams;
  const post = getPostBySlug(slug);

  if (!post) {
    console.error(`Post not found for slug: ${slug}`);
    notFound();
  }

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
    keywords: (post.tags || []).join(", "),
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
            <Reveal as="span" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={styles.backArrow}>←</span> All posts
            </Reveal>
          </Link>
        </nav>

        <article className={styles.article} itemScope itemType="https://schema.org/BlogPosting">
          <header className={styles.header}>
            <Reveal className={styles.meta}>
              <time className={styles.date} dateTime={post.date} itemProp="datePublished">
                {formatDate(post.date)}
              </time>
              {post.readTime && (
                <span className={styles.readTime}>{post.readTime}</span>
              )}
            </Reveal>
            <Reveal as="h1" className={styles.title} itemProp="headline">{post.title}</Reveal>
            <Reveal as="p" className={styles.description} itemProp="description">{post.description}</Reveal>
            <Reveal className={styles.tags}>
              {(post.tags || []).map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </Reveal>
            
            <Reveal className={styles.aiSection}>
              <span className={styles.aiLabel}>Open with AI:</span>
              <div className={styles.aiButtons}>
                <a 
                  href={`https://chatgpt.com/?q=Summarize+this+article:+${encodeURIComponent(`${siteUrl}/blogs/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.aiButton}
                >
                  ChatGPT
                </a>
                <a 
                  href={`https://claude.ai/new?q=Summarize+this+article:+${encodeURIComponent(`${siteUrl}/blogs/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.aiButton}
                >
                  Claude
                </a>
                <a 
                  href={`https://grok.com/?q=Summarize+this+article:+${encodeURIComponent(`${siteUrl}/blogs/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.aiButton}
                >
                  Grok
                </a>
                <a 
                  href={`https://gemini.google.com/app?q=Summarize+this+article:+${encodeURIComponent(`${siteUrl}/blogs/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.aiButton}
                >
                  Gemini
                </a>
              </div>
            </Reveal>

            <meta itemProp="author" content={homeData.landing.name} />
          </header>

          <div className={styles.content} itemProp="articleBody">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <footer className={styles.footer} aria-label="Post navigation">
          <Link href="/blogs" className={styles.backLink}>
            <Reveal as="span" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={styles.backArrow}>←</span> Back to all posts
            </Reveal>
          </Link>
        </footer>

        <hr className={styles.rule} />

        <footer className={styles.siteFooter} aria-label="Site footer">
          <Reveal as="span">© {new Date().getFullYear()} {homeData.landing.name}</Reveal>
          <Reveal as="span">v{homeData.updatedAt}</Reveal>
        </footer>
      </div>
    </main>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateStr;
  }
}
