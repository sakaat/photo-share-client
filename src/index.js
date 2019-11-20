import ApolloClient, { InMemoryCache } from "apollo-boost";
import { persistCache } from "apollo-cache-persist";
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

const client = new ApolloClient({
    cache,
    uri: "http://localhost:4000/graphql",
    request: (operation) => {
        operation.setContext((context) => ({
            headers: {
                ...context.headers,
                authorization: localStorage.getItem("token"),
            },
        }));
    },
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
