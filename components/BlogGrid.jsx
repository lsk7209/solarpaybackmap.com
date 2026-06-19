"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCategoryPath } from "@/lib/categories";
import { formatDisplayDate, toDateTime } from "@/lib/dates";

export function BlogGrid({ posts, showCategories = true }) {
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.category))).sort()],
    [posts]
  );
  const visiblePosts = useMemo(
    () => posts.filter((post) => category === "All" || post.category === category),
    [category]
  );

  return (
    <>
      {showCategories ? (
        <nav className="chips" aria-label="Filter posts by category">
          {categories.map((item) =>
            item === "All" ? (
              <button
                className={`chip ${category === item ? "on" : ""}`}
                type="button"
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ) : (
              <Link
                className={`chip ${category === item ? "on" : ""}`}
                href={getCategoryPath(item)}
                key={item}
                aria-label={`${item} solar payback topic hub`}
              >
                {item}
              </Link>
            )
          )}
        </nav>
      ) : null}
      <p className="post-count-summary" aria-live="polite">
        Showing {visiblePosts.length} published solar payback articles.
      </p>
      <ol className="post-grid" aria-label="Article list">
        {visiblePosts.map((post) => (
          <li key={post.slug}>
            <Link
              className="post-card"
              href={`/blog/${post.slug}`}
              data-category={post.category}
              aria-labelledby={`post-${post.slug}-title`}
              aria-describedby={`post-${post.slug}-summary`}
            >
              <div className="post-visual" aria-hidden="true" />
              <div className="post-body">
                <h3 id={`post-${post.slug}-title`}>{post.title}</h3>
                <p id={`post-${post.slug}-summary`}>{post.excerpt}</p>
                <dl className="meta-row" aria-label={`${post.title} article metadata`}>
                  <div>
                    <dt>Category</dt>
                    <dd>{post.category}</dd>
                  </div>
                  <div>
                    <dt>Published</dt>
                    <dd>
                    <time dateTime={toDateTime(post.publishAt || post.date)}>
                      {formatDisplayDate(post.publishAt || post.date)}
                    </time>
                    </dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd><time dateTime={toDateTime(post.updated)}>{formatDisplayDate(post.updated)}</time></dd>
                  </div>
                  <div>
                    <dt>Read time</dt>
                    <dd>{post.read} min read</dd>
                  </div>
                  {post.articleType ? (
                    <div>
                      <dt>Type</dt>
                      <dd>{post.articleType}</dd>
                    </div>
                  ) : null}
                  {post.qualityScore ? (
                    <div>
                      <dt>Quality score</dt>
                      <dd>QS {post.qualityScore}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
