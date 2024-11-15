'use client'

import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://graphql.anilist.co',
    cache: new InMemoryCache(),
});

export default function Providers({ children }) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
        )
}