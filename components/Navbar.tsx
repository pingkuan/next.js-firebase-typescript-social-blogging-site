import Link from 'next/link';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@lib/context';
import { auth } from '@lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar: React.FC = () => {
  const { user, username } = useContext(UserContext);

  const router = useRouter();

  const signOutNow = () => {
    signOut(auth);
    router.reload();
  };

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link href='/'>
            <button className='btn-logo'>NXT</button>
          </Link>
        </li>
        {username && (
          <>
            <li className='push-left'>
              <button onClick={signOutNow}>Sign Out</button>
            </li>
            <li>
              <Link href='/admin'>
                <button className='btn-blue'>Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {!username && (
          <>
            <li>
              <Link href='/enter'>
                <button className='btn-blue'>Log in</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
