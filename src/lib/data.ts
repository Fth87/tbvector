export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
};
export type Post = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
  content: string;
};
export const initialUsers: User[] = [
  {
    id: 1,
    name: "Alya Putri",
    email: "alya@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: 2,
    name: "Raka Pratama",
    email: "raka@example.com",
    role: "editor",
    status: "active",
  },
  {
    id: 3,
    name: "Nadia Rahma",
    email: "nadia@example.com",
    role: "viewer",
    status: "inactive",
  },
];
export const initialPosts: Post[] = [
  {
    id: 1,
    title: "Panduan memulai proyek",
    slug: "panduan-memulai-proyek",
    status: "published",
    updatedAt: "2026-09-12",
    content: "<p>Mulai proyek dari template yang kecil dan mudah diubah.</p>",
  },
  {
    id: 2,
    title: "Catatan rilis September",
    slug: "catatan-rilis-september",
    status: "draft",
    updatedAt: "2026-09-10",
    content: "<p>Ringkasan perubahan pada rilis bulan September.</p>",
  },
];
