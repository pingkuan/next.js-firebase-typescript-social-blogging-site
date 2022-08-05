import styles from '@styles/Post.module.css';
import PostContent from '@components/PostContent';
import { getUserWithUsername, postToJSON } from '@lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  getFirestore,
  doc,
  query,
  collectionGroup,
  limit,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { Post } from 'types';
import AuthCheck from '@components/AuthCheck';
import Link from 'next/link';
import Metatags from '@components/Metatags';
import { useContext } from 'react';
import { UserContext } from '@lib/context';
import HeartButton from '@components/HeartButton';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { username, slug } = params;
  const title: string = slug.toString();

  const userDoc = await getUserWithUsername(username);

  let post: Post;
  let path: string;

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', title);

    post = postToJSON(await getDoc(postRef));

    if (!post.username) return { notFound: true };

    path = postRef.path;
  } else {
    return {
      notFound: true,
    };
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const q = query(collectionGroup(getFirestore(), 'posts'), limit(20));

  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const slug: string = doc.data().slug;
    const username: string = doc.data().username;

    return {
      params: { username, slug },
    };
  });
  return {
    paths,
    fallback: 'blocking',
  };
};

type Props = {
  path: string;
  post: Post;
};

const PostPage: NextPage<Props> = (props) => {
  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);
  const rPost = realtimePost as Post;
  const post: Post = rPost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />

      <section>
        <PostContent post={post} />
      </section>

      <aside className='card'>
        <p>
          <strong>
            {post.heartCount || 0}
            {post.heartCount > 0 ? '💗' : '🤍'}
          </strong>
        </p>

        <AuthCheck
          fallback={
            <Link href='/enter'>
              <button>💗Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className='btn-blue'>Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
};

export default PostPage;
