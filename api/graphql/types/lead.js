import graphQL from 'graphql';
import { CourseType } from './course.js'
import { UserType } from './user.js'

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
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
  }),
});

export default {
  LeadType,
};
