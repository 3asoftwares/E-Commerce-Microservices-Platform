import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '../src/schema/typeDefs';
import { resolvers } from '../src/schema/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create handler for Vercel serverless
const handler = startServerAndCreateNextHandler(server, {
  context: async (req: any) => {
    const token =
      req.headers.get?.('authorization')?.replace('Bearer ', '') ||
      req.headers?.authorization?.replace('Bearer ', '') ||
      '';
    return { token };
  },
});

export default handler;
