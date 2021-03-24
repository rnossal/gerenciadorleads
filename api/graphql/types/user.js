import graphQL from 'graphql';

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} = graphQL;

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    admin: {
      type: GraphQLBoolean,
    },
  }),
});

export default {
  UserType,
};
