import graphQL from 'graphql';
import { CourseType } from '../types/course.js';

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLSchema,
} = graphQL;

export const CoursesSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      course: {
        type: CourseType,
        args: {
          id: {
            type: GraphQLString,
          },
        },
      },
      courses: {
        type: new GraphQLList(CourseType),
        args: {
          name: {
            type: GraphQLString,
          },
        },
      },
    },
  }),
});

export default {
  CoursesSchema,
};
