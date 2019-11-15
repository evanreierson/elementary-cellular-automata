import { Resolvers } from "apollo-boost";
import {
  GET_CURRENT_RULE,
  GET_DENSITY,
  GET_ENVIRONMENT_DETAILS,
  GET_ENVIRONMENT
} from "./queries";
import { Cell } from "./types";

export const resolvers: Resolvers = {
  Query: {
    getCurrentRule: (_parent, _args, { cache }) => {
      return cache.readQuery({
        query: GET_CURRENT_RULE
      });
    },
    getDensity: (_parent, _args, { cache }) => {
      return cache.readQuery({
        query: GET_DENSITY
      });
    },
    // getEnvironment: (_parent, _args, { cache }) => {
    //   console.log("b");
    //   return cache.readQuery({
    //     query: GET_ENVIRONMENT
    //   });
    // },
    // getEnvironmentDetails: (_parent, _args, { cache }) => {
    //   return cache.readQuery({
    //     query: GET_ENVIRONMENT_DETAILS
    //   });
    // },
    getEnvironment: (_parent, _args, { cache }) => {
      console.log("getting env");
      let envDetails: {
        environmentState: Cell[][];
        cursor: number;
        size: number;
      } = cache.readQuery({ query: GET_ENVIRONMENT_DETAILS });

      return {
        environment: envDetails.environmentState.slice(
          envDetails.cursor,
          envDetails.cursor + envDetails.size
        )
      };
    }
  },

  Mutation: {
    setRule: (_parent, args: { currentRule: number }, { cache }) => {
      cache.writeData({ data: args });
      return { success: true };
    },
    setDensity: (_parent, args: { density: number }, { cache }) => {
      cache.writeData({ data: args });
      return { success: true };
    }
  }
};
