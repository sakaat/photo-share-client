import { ApolloClient, ApolloLink, InMemoryCache, split } from "apollo-boost";
import { persistCache } from "apollo-cache-persist";
import { WebSocketLink } from "apollo-link-ws";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "apollo-utilities";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const cache = new InMemoryCache();
persistCache({
    cache,
    storage: localStorage,
});

if (localStorage["apollo-cache-persist"]) {
    const cacheData = JSON.parse(localStorage["apollo-cache-persist"]);
    cache.restore(cacheData);
}

const httpLink = new createUploadLink({ uri: "http://localhost:4000/graphql" });
const authLink = new ApolloLink((operation, forward) => {
    operation.setContext((context) => ({
        headers: {
            ...context.headers,
            authorization: localStorage.getItem("token"),
        },
    }));
    return forward(operation);
});

const httpAuthLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
    uri: "ws://localhost:4000/graphql",
    options: { reconnect: true },
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpAuthLink,
);

const client = new ApolloClient({
    cache,
    link,
});

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
