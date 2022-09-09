import { trpc } from '../../utils/trpc';
import { useEffect } from 'react';

const useSpotifyUser = () => {
  const { data } = trpc.useQuery(['spotify.getUser']);

  useEffect(() => {
    console.log('useSpotifyUser', data);
  }, [data]);

  return data;
};

export default useSpotifyUser;
