import React from 'react';

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';



const client = new ApolloClient({
  cache: new InMemoryCache()
});


const App = () => (
<ApolloProvider client={client}>
  <div className="text-purple-600">
    Hello TypeScript, Apollo, and Tailwind
  </div>
</ApolloProvider>
);

export default App;
