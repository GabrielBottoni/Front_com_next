import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: typeof window === 'undefined'
            ? 'http://localhost:3000/api/graphql'
            : '/api/graphql',
    }),
    cache: new InMemoryCache(),
});

export default client;