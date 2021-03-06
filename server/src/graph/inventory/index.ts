import { makeExecutableSchema } from 'graphql-tools'; 
import GraphQLJSON from 'graphql-type-json';

import { IMutation, IQuery, IInvVerboseItem } from "./type.interface";
import * as typeDefs from "./type.graphql";
import { Action } from "./action";

class InventoryGraph {

  action = new Action();

  types: any = typeDefs; // in fact, 'types' is of type 'DocumentNode'

  getList: IQuery["getList"] = async (obj, args) => {

    let conditions: any = {};
    let lang = args.lang || "en";

    if (args.conditions) {
      conditions = JSON.parse(args.conditions);
    }

    return await this.action.getList(conditions, args.page, lang);
  };

  getSingle: IQuery["getSingle"] = async (obj, args) => {
    let itemName = args.itemName;
    let holder = args.holder;
    let lang = args.lang || "en";
    if (itemName && holder) {
      return await this.action.getSingle(itemName, holder, lang);
    }
    return {} as IInvVerboseItem;
  };

  gift: IMutation["gift"] = async (obj, args) => {
    return await this.action.gift(args.itemName, args.holder, args.num);
  };

  remove: IMutation["remove"] = async (obj, args) => {
    return await this.action.remove(args.itemName, args.holder, args.num);
  };


  resolvers = {
    Query: {
      invItems: this.getList,
      invItem: this.getSingle
    },
    Mutation: {
      gift: this.gift,
      remove: this.remove
    }
  }

  schema = makeExecutableSchema({typeDefs: this.types, resolvers: this.resolvers})

}

export const invItemGraph = new InventoryGraph().schema;