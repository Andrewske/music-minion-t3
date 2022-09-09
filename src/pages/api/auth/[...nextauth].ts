import NextAuth, { type NextAuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { env } from '../../../env/server.mjs';

//https://next-auth.js.org/tutorials/refresh-token-rotation#server-side
// async function refreshAccessToken(token) {

//   try {
//     const url = 'https://accounts.spotify.com/api/token';
//     new URLSearchParams({
//       client_id: env.SPOTIFY_CLIENT_ID,
//       client_secret: env.SPOTIFY_CLIENT_SECRET,
//       grant_type: 'refresh_token',
//       refresh_token: token.refresh_token,
//     });

//     const response = await fetch(url, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       method: 'POST',
//     });

//     console.log({ response });

//     const refreshedTokens = await response.json();

//     if (!response.ok) {
//       throw refreshedTokens;
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refresh_token,
//     };
//   } catch (error) {
//     console.log(error);

//     return {
//       ...token,
//       error: 'RefreshAccessTokenError',
//     };
//   }
// }

export const authOptions: NextAuthOptions = {
  // jwt: {
  //   maxAge: 60 * 60 * 24 * 30,
  // },
  // Include user.id on session
  callbacks: {
    //   async jwt({ token, user, account }) {
    //     console.log({ token, account });
    //     if (account && user) {
    //       return {
    //         accessToken: account.access_token,
    //         accessTokenExpires: Date.now() + (account?.expires_at ?? 0) * 1000,
    //         refreshToken: account.refresh_token,
    //         user,
    //       };
    //     }

    //     if (Date.now() < (token?.accessTokenExpires ?? Date.now())) {
    //       return token;
    //     }

    //     return refreshAccessToken(token);
    //   },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
