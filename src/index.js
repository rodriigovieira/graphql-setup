import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';

import {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
} from './resolvers';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment,
    },
    context: { db, pubsub },
})

server.start(() => console.log('The server is up!'));
