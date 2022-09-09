import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { trpc } from '../../utils/trpc';

const useSpotifyRefreshToken = () => {
  const { data: session, status } = useSession();
  //const { data: expiresAt } = trpc.useQuery(['spotify.expiresAt']);
  const { data: tokenIsSet } = trpc.useQuery(['spotify.setToken']);
  //const data = trpc.useQuery(['spotify.refreshToken']);

  // useEffect(() => {
  //   console.log({ expiresAt, date: Date.now() });
  //   const checkTime = setTimeout(() => {
  //     if (expiresAt && Date.now() >= expiresAt) {
  //       console.log('here');
  //       const data = trpc.useQuery(['spotify.refreshToken']);
  //       console.log('refreshToken', data);
  //     }
  //   }, 1000);
  //   return () => clearTimeout(checkTime);
  // }, []);
  return true;
};

export default useSpotifyRefreshToken;
