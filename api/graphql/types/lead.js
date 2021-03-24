import graphQL from 'graphql';

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
  }),
});

export default {
  LeadType,
};
