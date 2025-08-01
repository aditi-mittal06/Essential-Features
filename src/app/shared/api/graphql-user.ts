import gql from 'graphql-tag';

export const GraphQLUser = {
  login: gql`
    mutation login($idToken: String!) {
      login(idToken: $idToken) {
        success
        errors {
          code
          message
        }
      }
    }
  `,
};
