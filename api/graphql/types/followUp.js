import graphQL from 'graphql';
import graphQLIsoDate from 'graphql-iso-date';
import { UserType } from './user.js'

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = graphQL;
const { GraphQLDateTime } = graphQLIsoDate;

export const FollowUpType = new GraphQLObjectType({
  name: 'FollowUp',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    status: {
      type: GraphQLInt,
    },
    createdAt: {
      type: GraphQLDateTime,
    },
    createdBy: {
      type: UserType,
    },
  }),
});

export default {
  FollowUpType,
};
