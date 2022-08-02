import Loader from '@components/Loader';
import PostFeed from '@components/PostFeed';
import { postToJSON } from '@lib/firebase';
import { Post } from 'types';
import {
  collectionGroup,
  getFirestore,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  startAfter,
} from 'firebase/firestore';
import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import Metatags from '@components/Metatags';

const LIMIT: number = 10;

export const getServerSideProps: GetServerSideProps = async ({}) => {
  const ref = collectionGroup(getFirestore(), 'posts');
  const postsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  );

  const posts: Array<Post> = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts },
  };
};

type Props = {
  posts: Array<Post>;
};

const Home: NextPage<Props> = (props) => {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last: Post = posts[posts.length - 1];

    const cursor: Timestamp =
      typeof last.createdAt === 'number'
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const ref = collectionGroup(getFirestore(), 'posts');
    const postsQuery = query(
      ref,
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts: Array<Post> = (await getDocs(postsQuery)).docs.map(
      postToJSON
    );

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags title='Home Page' description='Get the latest posts' />

      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
};

export default Home;
