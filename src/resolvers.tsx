import { Resolvers, gql } from "apollo-boost";
import {
  GET_CURRENT_RULE,
  GET_DENSITY,
  GET_ENVIRONMENT_DETAILS,
  GET_ENVIRONMENT
} from "./queries";
import { Cell } from "./types";
import { nextRow, generateRows } from "./ecaHelpers";

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
    getEnvironment: (_parent, _args, { cache }) => {
      console.log("getting env");
      let envDetails: {
        environmentState: Cell[][];
        cursor: number;
        size: number;
      } = cache.readQuery({ query: GET_ENVIRONMENT_DETAILS });
      console.log(envDetails.cursor);
      console.log(envDetails.environmentState);
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
      let envDetails: {
        size: number;
        currentRule: number;
        density: number;
      } = cache.readQuery({
        query: gql`
          {
            size @client
            currentRule @client
            density @client
          }
        `
      });

      cache.writeData({
        data: {
          ...args,
          environmentState: generateRows(
            envDetails.size,
            envDetails.density,
            args.currentRule
          ),
          cursor: 0
        }
      });

      return { success: true };
    },
    setDensity: (_parent, args: { density: number }, { cache }) => {
      cache.writeData({ data: args });
      return { success: true };
    },
    stepForward: (_parent, _args, { cache }) => {
      console.log("forward");
      let envDetails: {
        environmentState: Cell[][];
        cursor: number;
        size: number;
        currentRule: number;
      } = cache.readQuery({
        query: gql`
          {
            environmentState @client
            cursor @client
            size @client
            currentRule @client
          }
        `
      });
      envDetails.environmentState.push(
        nextRow(
          envDetails.environmentState[envDetails.cursor + envDetails.size - 1],
          envDetails.currentRule
        )
      );
      envDetails.cursor += 1;

      cache.writeData({
        data: {
          environmentState: envDetails.environmentState,
          cursor: envDetails.cursor
        }
      });
      return { success: true };
    }
  }
};
