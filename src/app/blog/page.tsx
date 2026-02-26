import Link from "next/link";
import { posts } from "@/lib/posts";

export const metadata = {
  title: "Blog — Postman",
  description: "Articles on email deliverability, SPF, DKIM, DMARC, and keeping your domain out of spam.",
};

export default function BlogPage() {
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

      <section className="flex-1 px-6 sm:px-8 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-neutral-900 mb-2">
            Blog
          </h1>
          <p className="text-neutral-600 mb-10">
            Email deliverability, SPF, DKIM, DMARC, and how to keep your mail out of spam.
          </p>

          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <h2 className="font-display text-xl font-semibold text-neutral-900 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-2 text-neutral-600">
                    {post.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-neutral-200/80 py-6">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center text-sm text-neutral-500">
          Postman — instant spam risk check for your domain.
        </div>
      </footer>
    </main>
  );
}
