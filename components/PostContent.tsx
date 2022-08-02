import { Post } from 'types';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { DocumentData } from 'firebase/firestore';

export default function PostContent({ post }: { post: Post | DocumentData }) {
  const createdAt: Date =
    typeof post?.createdAt === 'number'
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className='card'>
      <h1>{post?.title}</h1>
      <span className='text-sm'>
        Written by{' '}
        <Link href={`/${post.username}/`}>
          <a className='text-info'>@{post.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}
