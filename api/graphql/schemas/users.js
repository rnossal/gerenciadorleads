import graphQL from 'graphql';
import { UserType } from '../types/user.js';

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLSchema,
} = graphQL;

export const UsersSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      user: {
        type: UserType,
        args: {
          id: {
            type: GraphQLString,
          },
        },
      },
      users: {
        type: new GraphQLList(UserType),
        args: {
          username: {
            type: GraphQLString,
          },
          name: {
            type: GraphQLString,
          },
          email: {
            type: GraphQLString,
          },
        },
      },
    },
  }),
});

export default {
  UsersSchema,
};
