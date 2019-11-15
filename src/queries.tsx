import gql from "graphql-tag";

export const GET_CURRENT_RULE = gql`
  query GetCurrentRule {
    currentRule @client
  }
`;

export const GET_DENSITY = gql`
  query GetDensity {
    density @client
  }
`;

export const GET_STATE = gql`
  {
    currentRule @client
    density @client
  }
`;

export const SET_DENSITY = gql`
  mutation setDensity($density: Float!) {
    setDensity(density: $density) @client {
      success
    }
  }
`;

export const SET_RULE = gql`
  mutation setRule($currentRule: Int!) {
    setRule(currentRule: $currentRule) @client {
      success
    }
  }
`;

export const GET_ENVIRONMENT_DETAILS = gql`
  {
    environmentState @client
    cursor @client
    size @client
  }
`;

export const GET_ENVIRONMENT = gql`
  query getEnvironment {
    environment @client
  }
`;
