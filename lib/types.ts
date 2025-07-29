import { Id } from '@/convex/_generated/dataModel';

export interface UrlData {
  _id: Id<'urls'>;
  _creationTime: number;
  userId?: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: number;
}

export interface UserData {
  _id: Id<'users'>;
  _creationTime: number;
  name: string;
  email: string;
  emailVerified?: string;
  image?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ShortenedUrl {
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
}
