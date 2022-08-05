import { NextPage } from 'next';
import Link from 'next/link';

const Custom404: NextPage = () => {
  return (
    <main>
      <h1>404 -That page does not seem to exist...</h1>
      <iframe
        src='https://c.tenor.com/4KmL9RgfmlQAAAAd/otter-shock.gif'
        width='480'
        height='362'
        frameBorder='0'
        allowFullScreen
      ></iframe>
      <Link href='/'>
        <button className='btn-blue'>GO home</button>
      </Link>
    </main>
  );
};

export default Custom404;
