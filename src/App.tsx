import React from "react";

import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";

import {
  ViewEnvironment,
  ViewRuleInput,
  ViewDensityInput,
  ViewTimeControls
} from "./components/environment";
import { resolvers } from "./resolvers";
import { generateRows } from "./ecaHelpers";

const cache = new InMemoryCache();
cache.writeData({
  data: {
    currentRule: 45,
    density: 0.1,
    cursor: 0,
    size: 50,
    environmentState: generateRows(50, 0.1, 45)
  }
});

const client = new ApolloClient({
  cache,
  resolvers: resolvers
});

const App = () => (
  <ApolloProvider client={client}>
    <div className="flex flex-row">
      <ViewEnvironment />
      <div>
        <ViewRuleInput />
        <ViewDensityInput />
        <ViewTimeControls />
      </div>
    </div>
  </ApolloProvider>
);

export default App;
