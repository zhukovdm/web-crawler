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
  resolveLinks,
  resolveNodes,
  resolveWebPage,
  resolveWebPages
} from "./resolver";

/* Resolver function signature: (source, args, context, info) => ...
 *  - https://graphql.org/learn/execution/#root-fields-resolvers
 */

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
  fields: () => ({
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
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(NodeType))),
      resolve: async ({ links, owner }, _a, { model }) => (await resolveLinks(model, owner, links))
    },
    owner: {
      type: new GraphQLNonNull(WebPageType),
      resolve: async ({ owner }, _a, { model }) => (await resolveWebPage(model, owner))
    }
  })
}) as GraphQLObjectType;

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      websites: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(WebPageType))),
        resolve: async (_s, _a, { model }) => (await resolveWebPages(model))
      },
      nodes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(NodeType))),
        args: {
          webPages: {
            type: new GraphQLList(new GraphQLNonNull(GraphQLID))
          }
        },
        resolve: async (_s, { webPages }, { model }) => (
          await resolveNodes(model,
            (webPages ?? []).filter((p: any) => !isNaN(p)).map((p: any) => parseInt(p))))
      }
    }
  })
});
