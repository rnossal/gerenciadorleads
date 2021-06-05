import graphQL from 'graphql';
import { CourseType } from './course.js'
import { UserType } from './user.js'
import { FollowUpType } from './followUp.js'

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
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
    coursesOfInterest: {
      type: new GraphQLList(CourseType),
    },
    observations: {
      type: GraphQLString,
    },
    createdBy: {
      type: UserType,
    },
    followUpHistory: {
      type: GraphQLList(FollowUpType)
    },
    status: {
      type: GraphQLInt,
    },
  }),
});

export default {
  LeadType,
};
