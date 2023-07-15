import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from "graphql";

const WebPageType = new GraphQLObjectType({
  name: "WebPage",
  fields: {
    identifier: {
      type: new GraphQLNonNull(GraphQLID)
    },
    label: {
      type: new GraphQLNonNull(GraphQLString)
    },
    url: {
      type: new GraphQLNonNull(GraphQLString)
    },
    regexp: {
      type: new GraphQLNonNull(GraphQLString)
    },
    tags: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    },
    active: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  }
}) as GraphQLObjectType<any, any>;

const NodeType = new GraphQLObjectType({
  name: "Node",
  fields: () => (
    {
      title: {
        type: GraphQLString
      },
      url: {
        type: new GraphQLNonNull(GraphQLString)
      },
      crawlTime: {
        type: GraphQLString
      },
      links: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(NodeType)))
      },
      owner: {
        type: new GraphQLNonNull(WebPageType)
      }
    })
}) as GraphQLObjectType<any, any>;

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      websites: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(WebPageType)))
      },
      nodes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(NodeType)))
      }
    }
  })
});
