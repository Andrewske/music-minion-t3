import useSpotifyUser from '../../hooks/spotify/useSpotifyUser';

const Sidebar = () => {
  const spotifyUser = useSpotifyUser();

  return <div>{spotifyUser}</div>;
};

export default Sidebar;
