import graphQL from 'graphql';
import { UserType } from './user.js'

const {
  GraphQLObjectType,
  GraphQLString,
} = graphQL;

export const LeadType = new GraphQLObjectType({
  name: 'Lead',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    observations: {
      type: GraphQLString,
    },
    createdBy: {
      type: UserType,
    },
  }),
});

export default {
  LeadType,
};
