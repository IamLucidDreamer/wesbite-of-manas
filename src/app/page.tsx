import styles from "./page.module.scss";
import { getAllPosts } from "@/lib/posts";
import Hero from "@/components/Hero";
import Writing from "@/components/Writing";
import Footer from "@/components/Footer";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <main className={styles.main}>
      <Hero />
      <hr className={styles.rule} />
      <Writing posts={posts} />
      <hr className={styles.rule} />
      <Footer />
    </main>
  );
}
