import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from "graphql";
import {
  resolveNodes,
  resolveWebPages
} from "./graphql-resolver";
import { IModel } from "./domain/interfaces";

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
}) as GraphQLObjectType;

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
    }),
  //resolve: () => 
}) as GraphQLObjectType;

/**
 * Get a schema with binded model.
 */
export function getSchema(model: IModel): GraphQLSchema {

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: {
        websites: {
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(WebPageType))),
          resolve: async () => (await resolveWebPages(model))
        },
        nodes: {
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(NodeType))),
          args: {
            webPages: {
              type: new GraphQLList(new GraphQLNonNull(GraphQLID))
            }
          },
          resolve: async (_, { webPages }) => (
            await resolveNodes(
              (webPages ?? []).filter((p: any) => !isNaN(p)).map((p: any) => parseInt(p))))
        }
      }
    })
  });
}
