import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Blog — Postman" };
  return {
    title: `${post.title} — Postman`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200/80 bg-neutral-50/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="text-lg font-display font-semibold tracking-tight text-neutral-900">
            Postman
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-neutral-900">
              Blog
            </Link>
            <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
              Check your domain
            </Link>
          </nav>
        </div>
      </header>

      <article className="flex-1 px-6 sm:px-8 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="text-sm text-accent hover:underline mb-6 inline-block">
            ← Blog
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-neutral-900 leading-tight">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div
            className="mt-8 prose prose-neutral max-w-none prose-p:text-neutral-700 prose-headings:font-display prose-headings:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-xl prose-ul:my-4 prose-li:my-1 prose-code:bg-neutral-100 prose-code:px-1 prose-code:rounded prose-code:text-sm"
            dangerouslySetInnerHTML={{ __html: post.body.trim() }}
          />
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link
              href="/blog"
              className="text-sm font-medium text-accent hover:underline"
            >
              ← All posts
            </Link>
          </div>

          <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-neutral-200 bg-neutral-100/50">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-neutral-900">
              Is your email landing where it should?
            </h2>
            <p className="mt-2 text-neutral-600">
              Instant spam risk check for your email provider or your own domain.
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              No database, no sign-up.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center py-3 px-6 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Check and fix
            </Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-neutral-200/80 py-6">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center text-sm text-neutral-500">
          Postman — instant spam risk check for your domain.
        </div>
      </footer>
    </main>
  );
}
