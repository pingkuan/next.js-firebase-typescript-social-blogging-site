import { getUserWithUsername, postToJSON } from '@lib/firebase';
import {
  query,
  collection,
  where,
  getDocs,
  limit,
  orderBy,
  getFirestore,
} from 'firebase/firestore';
import UserProfile from '@components/UserProfile';
import PostFeed from '@components/PostFeed';
import { GetServerSideProps, NextPage } from 'next';
import { Post, UserProps } from 'types';

export const getServerSideProps: GetServerSideProps = async ({
  query: urlQuery,
}) => {
  const { username } = urlQuery;

  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  let user: unknown = null;
  let posts: Array<Post> = null;

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
};

type Props = {
  user: UserProps;
  posts: Array<Post>;
};

const UserProfilePage: NextPage<Props> = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;
