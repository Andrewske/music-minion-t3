import type { NextPage } from 'next';
import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { trpc } from '../utils/trpc';
import Sidebar from '../components/Sidebar/sidebar';
import useSpotifyRefreshToken from '../hooks/spotify/useSpotifyRefreshToken';

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const { isLoading: isLoadingToken } = trpc.useQuery(['spotify.setToken']);

  const { data: user } = trpc.useQuery(['spotify.getUser'], {
    enabled: !isLoadingToken,
  });

  useEffect(() => console.log({ user }), [user]);

  if (status === 'loading') {
    return <main>Loading...</main>;
  }

  return (
    <>
      <Head>
        <title>Music Minion</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* <Sidebar /> */}

      <main className='container mx-auto flex flex-col items-center justify-center min-h-screen p-4'>
        <h1 className='text-4xl'>Music Minion</h1>

        <button className=''>Search Spotify</button>

        {session ? (
          <div>
            <p>hi {session.user?.name}</p>

            <button onClick={() => signOut()}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => signIn('spotify')}>
              Login with Spotify
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
