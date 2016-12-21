import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import config from '../config.json'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        args: {
          name: { type: GraphQLString },
        },
        resolve (root, { name = 'world' }) {
          return name
        },
      },
    },
  }),
})

export const handleRequest = (event, context, callback) => {
  // http://graphql.org/graphql-js/graphql/#graphql
  graphql(schema, event.queryStringParameters.query)
    .then(result => callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': config.enableCors ? '*' : false,  // TODO: make this better. e.g. don't include it at all if false, also allow to provide host value instead of just forcing *
      },
      body: JSON.stringify(result),
    }))
    .catch(err => callback(err, {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(err),
    }))
}
