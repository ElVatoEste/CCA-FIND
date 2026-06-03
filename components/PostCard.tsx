"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { formatDate } from "@/lib/format";
import { StatusText, TypeBadge } from "@/components/ui";
import type { PostStatus, PostType } from "@prisma/client";

export type PostCardData = {
  id: string;
  type: PostType;
  title: string;
  location: string;
  status: PostStatus;
  createdAt: Date;
  category: { name: string; color: string };
  images: { url: string }[];
};

const ease = [0.16, 1, 0.3, 1] as const;

export function PostCard({ post, index = 0 }: { post: PostCardData; index?: number }) {
  const img = post.images[0]?.url;
  const reduce = useReducedMotion();

  return (
    <motion.div
      layout
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05, ease }}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      <Link
        href={`/publicacion/${post.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/5"
      >
        <div className="relative h-44 w-full overflow-hidden bg-surface-2">
          {img ? (
            <Image
              src={img}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Sin foto
            </div>
          )}
          <div className="absolute left-3 top-3">
            <TypeBadge type={post.type} />
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <h3 className="font-semibold text-ink transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-ink-soft">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: post.category.color }}
            />
            <span className="truncate">
              {post.category.name} · {post.location}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-xs text-muted">
              {formatDate(post.createdAt)}
            </span>
            <StatusText status={post.status} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
