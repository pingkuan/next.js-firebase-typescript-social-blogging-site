import { DocumentData, Timestamp } from 'firebase/firestore';

type PostFeedProps = {
  posts: Array<Post> | Array<DocumentData>;
  admin?: boolean;
};

type Post = {
  title: string;
  slug: string;
  uid: string;
  username: string;
  published: boolean;
  content: string;
  createdAt: Timestamp | number;
  updatedAt: Timestamp | number;
  heartCount: number;
};

type PostItemProps = {
  post: Post;
  admin?: boolean;
};

type UserProps = {
  username: string;
  displayName: string;
  photoURL: string;
};
export type { Post, PostFeedProps, PostItemProps, UserProps };
