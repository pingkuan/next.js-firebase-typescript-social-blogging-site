import Head from 'next/head';

type Props = {
  title: string;
  description: string;
};

const Metatags: React.FC<Props> = ({
  title = 'Next + Firebase project',
  description = 'Next.js +Firebase with typescript',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />

      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
    </Head>
  );
};

export default Metatags;
