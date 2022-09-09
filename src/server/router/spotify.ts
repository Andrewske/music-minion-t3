import { createRouter } from './context';
import { z } from 'zod';
import { prisma } from '../db/client';
import SpotifyWebApi from 'spotify-web-api-node';
import { env } from '../../env/server.mjs';

const spotifyApi = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
});

export const spotifyRouter = createRouter()
  .query('setToken', {
    async resolve({ ctx }) {
      const userId = ctx.session?.user?.id;

      if (userId) {
        const { accountId, access_token, refresh_token, updatedAt } =
          await ctx.prisma.account
            .findFirst({
              where: { userId },
            })
            .then((data) => {
              return {
                accountId: data?.id,
                access_token: data?.access_token,
                refresh_token: data?.refresh_token,
                updatedAt: data?.updatedAt,
              };
            });

        if (access_token && refresh_token) {
          spotifyApi.setAccessToken(access_token);
          spotifyApi.setRefreshToken(refresh_token);
        }

        const expires_at = new Date(updatedAt);

        if (Date.now() >= expires_at.getMilliseconds() + 60 * 60 * 1000) {
          await spotifyApi.refreshAccessToken().then(
            async (data) => {
              const access_token = data.body.access_token;
              spotifyApi.setAccessToken(access_token);
              //console.log('refreshing...', expires_at);

              try {
                const accountRes = await prisma.account.update({
                  where: { id: accountId },
                  data: { access_token },
                });
                return accountRes;
              } catch (err) {
                throw err;
              }
            },
            (err) => {
              console.log('error refreshToken', err);
              return null;
            }
          );
        }
      }

      return true;
    },
  })
  .query('getUser', {
    async resolve() {
      try {
        const { body } = await spotifyApi.getMe();

        return body;
      } catch (error) {
        console.error(error);
      }
    },
  })
  .query('getUserPlaylists', {
    async resolve() {
      //const data = spotifyApi.getUserPlaylists();
    },
  });
