import ApolloClient, { gql } from "apollo-boost";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({ uri: "http://localhost:4000/graphql" });

const query = gql`
    {
        totalUsers
        totalPhotos
    }
`;

console.log("cache", client.extract());
client
    .query({ query })
    .then(() => console.log("cache", client.extract()))
    .catch(console.error);

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
