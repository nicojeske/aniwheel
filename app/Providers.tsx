'use client'

import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const client = new ApolloClient({
    uri: 'https://graphql.anilist.co',
    cache: new InMemoryCache(),
});

const queryClient = new QueryClient();

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={client}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ApolloProvider>
    )
}