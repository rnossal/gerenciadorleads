import graphQL from 'graphql';
import { UserType } from './user.js'

const {
  GraphQLObjectType,
  GraphQLString,
} = graphQL;

export const CourseType = new GraphQLObjectType({
  name: 'Course',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    createdBy: {
      type: UserType,
    },
  }),
});

export default {
  CourseType,
};
