import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextAuthOptions } from 'next-auth';

/**
 * NextAuth Configuration
 *
 * Defines authentication settings for the application including:
 * - Custom credential authentication with email/password
 * - Prisma adapter for database integration
 * - JWT session handling
 * - Custom callbacks for adding user ID to session
 *
 * @type {NextAuthOptions}
 */
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter to connect NextAuth with our database
  adapter: PrismaAdapter(prisma),

  // Define authentication providers
  providers: [
    // Email/password authentication
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Authorize user login by checking credentials against database
       *
       * @param credentials - Email and password from login form
       * @returns User object if authentication succeeds, null otherwise
       */
      async authorize(credentials) {
        // Validate that credentials were provided
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { userCredential: true },
        });

        // Check if user exists and has password credentials
        if (!user || !user.userCredential?.password) {
          return null;
        }

        // Verify password with bcrypt
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.userCredential.password
        );

        // Return user object if password matches, null otherwise
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  // Use JWT strategy for session handling
  session: {
    strategy: 'jwt',
  },

  // Callbacks to customize session and token behavior
  callbacks: {
    /**
     * Add user ID to session object from JWT token
     * Allows components to access user ID from session
     *
     * @param params - Session and token objects
     * @returns Modified session object with user ID
     */
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  // Custom pages for authentication flows
  pages: {
    signIn: '/auth/signin',
  },

  // Secret used for JWT signing and encryption
  secret: process.env.NEXTAUTH_SECRET,
};
