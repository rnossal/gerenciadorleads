import graphQL from 'graphql';
import { LeadType } from '../types/lead.js';

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLSchema,
} = graphQL;

export const LeadsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      lead: {
        type: LeadType,
        args: {
          id: {
            type: GraphQLString,
          },
        },
      },
      leads: {
        type: new GraphQLList(LeadType),
        args: {
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
          coursesOfInterest: {
            type: GraphQLList(GraphQLString),
          },
        },
      },
    },
  }),
});

export default {
  LeadsSchema,
};
