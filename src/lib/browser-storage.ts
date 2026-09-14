import type { Post, User } from "$lib/data";

const USERS_KEY = "dashboard-template.users";
const POSTS_KEY = "dashboard-template.posts";

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

export const userStorage = {
  read: (fallback: User[]) => read(USERS_KEY, fallback),
  write: (users: User[]) =>
    localStorage.setItem(USERS_KEY, JSON.stringify(users)),
};

export const postStorage = {
  read: (fallback: Post[]) => read(POSTS_KEY, fallback),
  write: (posts: Post[]) =>
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts)),
};
