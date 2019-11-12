import React from "react";

import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";

import { ViewGrid } from "./components/grid";

const client = new ApolloClient({
  cache: new InMemoryCache()
});

const App = () => (
  <ApolloProvider client={client}>
    <ViewGrid />
  </ApolloProvider>
);

export default App;
