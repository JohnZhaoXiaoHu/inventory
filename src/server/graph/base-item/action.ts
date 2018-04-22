import { IBaseItem, INewBaseItem } from "./type.interface";

// actions
import { BaseItemAction } from "../../action/base-item.action";
import { TranslationAction } from "../../action/translation.action";
import { GearAction } from "../../action/gear.action";
import { ConsumableAction } from "../../action/consumable.action";
import { BookAction } from "../../action/book.action";

const baseItemAction = new BaseItemAction();
const translationAction = new TranslationAction();

interface ITranslatedEffect {

  effect: string,
  name: string

}

export class Action {

  add = async (input: INewBaseItem) => {
    
    // insert into baseItems collection
    
    let newBaseItem: INewBaseItem = await baseItemAction.add(input);

    if (newBaseItem) {

      // create translations
      if (input.translations) {
        await translationAction.add({
          dbname: newBaseItem.dbname,
          name: input.translations.name,
          description: input.translations.description
        });

        // books need to add translations
        if (newBaseItem.category === "books" && input.detail["content"]) {
          await translationAction.add({
            dbname: input.detail["content"],
            description: input.translations.bookContent
          });
        }

      }
      
      // according to "category", insert detail info to corresponing col.
      let detailAction = this.selectAction(newBaseItem.category)

      if (detailAction) {

        let newDetail = await detailAction.add({
          dbname: newBaseItem.dbname,
          ...input.detail
        });

        if (newDetail) {
          return {
            message: `Successfully created new baseItem "${newBaseItem.dbname}" with id "${newBaseItem["_id"]}"`,
            status: 'success',
            id: newBaseItem["_id"]
          };
        } else {
          return {
            message: `Failed to asign detail to baseItem "${input.dbname}"`,
            status: 'failure',
            id: newBaseItem["_id"]
          };
        }

      } else {
        return {
          message: `Failed to find appropriate action when trying to create new baseItem "${newBaseItem.dbname}"`,
          status: 'failure',
          id: newBaseItem["_id"]
        };
      }

    } else {
      return {
        message: `Failed to create new baseItem "${input.dbname}"`,
        status: 'failure',
        id: null
      };
    }

    // Then front-end will receive: 
    // {
    //   "data": {
    //     "add": {
    //       "message": "Successfully created new baseItem \"item-t60_pa_chest\" with id \"9090980\"",
    //       "status": "success",
    //       "id": "9090980"
    //     }
    //   }
    // }



  };

  getList = async (conditions: any = {}, page?: number, lang = "en") => {

    let metBaseItems = await baseItemAction.getList(conditions, page);
    let extractedItems: IBaseItem[] = [];

    // extract needed info from mongoose query result
    for (let item of metBaseItems) {

      let ext = this.extractInfo(item, baseItemAction.fields) as IBaseItem;

      // attach i18n info of base
      let translations = await translationAction.getSingle(ext.dbname);
      if (translations && translations[0]) {
        ext.name = translations[0]["name"][lang];
        ext.description = translations[0]["description"][lang];
      }

      extractedItems.push(ext);
    }



    // attach details
    for (let item of extractedItems) {
      item.detail = await this.attachDetail(item);
      // attach i18n info of detail type or equip
      if (item.detail["type"]) {
        
        let translations = await translationAction.getSingle(`type-${item.detail["type"]}`);
        if (translations && translations[0]) {
          item.detail["typeName"] = translations[0]["name"][lang];
        }
      }

      if (item.detail["equip"]) {
        let translations = await translationAction.getSingle(`equip-${item.detail["equip"]}`);
        if (translations && translations[0]) {
          item.detail["equipName"] = translations[0]["name"][lang];
        }
      }

      if (item.detail["effects"]) {
        item.detail["effectsI18n"] = await this.translateEffects(item.detail["effects"], lang);
      }

      // attach i18n info of book content
      if (item.detail["content"]) {
        let translations = await translationAction.getSingle(item.detail["content"]);
        if (translations && translations[0]) {
          item.detail["contentDetail"] = translations[0]["description"][lang];
        }
      }

    }
    return extractedItems;

    // e.g. front-end request
    // query getItemList($conditions: JSON, $page: Int) {
  
    //   baseItems: baseItems(conditions: $conditions, page: $page) {
    //     dbname,
    //     value,
    //     weight,
    //     category,
    //     detail
    //   }
    
    // }

    // ----- params -----

    // {
    //   "page": 1
    // }

  };

  getSingle = async (dbname: string, lang = "en") => {

    let baseItem: any = {};
    let metBaseItems = await baseItemAction.getSingle(dbname);

    if (metBaseItems && metBaseItems[0]) {
      // extract needed info from mongoose query result
      let rawItem = metBaseItems[0];
      baseItem = this.extractInfo(rawItem, baseItemAction.fields) as IBaseItem;

      // attach i18n info
      let translations = await translationAction.getSingle(baseItem.dbname);
      
      if (translations && translations[0]) {
        baseItem.name = translations[0]["name"][lang];
        baseItem.description = translations[0]["description"][lang];
      }

      // attach details
      baseItem.detail = await this.attachDetail(rawItem);

      // attach i18n info of detail type or equip
      if (baseItem.detail["type"]) {
        let translations = await translationAction.getSingle(baseItem.detail["type"]);
        if (translations && translations[0]) {
          baseItem.detail["typeName"] = translations[0]["name"][lang];
        }
      }

      if (baseItem.detail["equip"]) {
        let translations = await translationAction.getSingle(baseItem.detail["equip"]);
        if (translations && translations[0]) {
          baseItem.detail["equipName"] = translations[0]["name"][lang];
        }
      }

      if (baseItem.detail["effects"]) {
        baseItem.detail.effectsI18n = await this.translateEffects(baseItem.detail.effects, lang);
      }

      // attach i18n info of book content
      if (baseItem.detail["content"]) {
        let translations = await translationAction.getSingle(baseItem.detail["content"]);
        if (translations && translations[0]) {
          baseItem.detail["contentDetail"] = translations[0]["description"][lang];
        }
      }

    }

    return baseItem;


    // e.g. front-end request
    // query getItem($dbname: String) {
    //   baseItems: baseItem(dbname: $dbname) {
    //     dbname
    //     value
    //     weight
    //     category
    //     detail
    //   }
    // }

    // ----- params -----

    // {
    //   "dbname": "item-t60_pa_chest-t5"
    // }


  };

  delete = async (conditions: any) => {
    
    let matchInfo: any[] = [];

    if (conditions && (typeof conditions === 'string')) {
      conditions = JSON.parse(conditions);
    }

    let metBaseItems = await baseItemAction.getList(conditions);
    for (let item of metBaseItems) {
      // store matched item dbname and category
      matchInfo.push(
        {
          dbname: item.dbname,
          category: item.category
        }
      );

    }

    // delete details
    for (let item of matchInfo) {
      let action = this.selectAction(item.category);
      let detailDelResult = await action.delete({dbname: item.dbname});
      if (detailDelResult) {
        // delete base
        let baseDelResult = await baseItemAction.delete(conditions);
        if (baseDelResult) {
          return {
            message: `Successfully deleted selected baseItems`,
            status: 'success',
            rmCount: baseDelResult.n || 0
          };
        } else {
          return {
            message: `Deletion failure: base info`,
            status: 'failure',
            rmCount: 0
          };
        }
      } else {
        return {
          message: `Deletion failure: details`,
          status: 'failure',
          rmCount: 0
        };
      }

    }

    return {
      message: `Deletion failure: info mismatch`,
      status: 'failure',
      rmCount: 0
    };

  };

  selectAction = (category: string) => {
    let action: any = null;

    switch (category) {
      case 'gears':
      action = new GearAction();
        break;
      case 'consumables':
      action = new ConsumableAction();
        break;
      case 'books':
      action = new BookAction();
        break;
      default: 
        break;
    }
    return action;
  };

  extractInfo = (qResultItem: any, fields: string[]) => {
    let ext = {};
    for (let key of fields) {
      ext[key] = qResultItem[key];
    }
    return ext;
  };

  attachDetail = async (baseItem: any) => {
    let detail: any = {};
    let detailAction = this.selectAction(baseItem.category);
    if (detailAction) {

      let rawDetail = await detailAction.getSingle(baseItem.dbname);

      if (rawDetail && rawDetail.length > 0) {
        detail = this.extractInfo(rawDetail[0], detailAction.fields);
      }

    }
    return detail;
  };

  translateEffects = async (effects: string[], lang = "en") => {
    let effectsI18n: ITranslatedEffect[] = [];
    // e.g.
    // {
    //   effect: "effect-increse_intelligence",
    //   name: "提升智力"
    // }

    for (let effect of effects) {
      // effect is of type string
      let effectTranslation = await translationAction.getSingle(effect);
      let effectI18n: ITranslatedEffect = { effect: effect, name: "" };
      if (effectTranslation && effectTranslation[0]) {
        effectI18n.name = effectTranslation[0]["name"][lang];
      }
      effectsI18n.push(effectI18n);
    }

    return effectsI18n;
  };




}