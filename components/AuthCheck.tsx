import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@lib/context';

type Props = {
  children?: JSX.Element;
  fallback?: JSX.Element;
};

const AuthCheck = (props: Props) => {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || <Link href='/enter'>You must be signed in</Link>;
};

export default AuthCheck;
