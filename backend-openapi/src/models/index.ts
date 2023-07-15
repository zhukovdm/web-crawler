import {
  ICrawlerModel,
  IExecutionModel,
  IRecordModel
} from "../domain/model-interfaces";
import {
  MySqlCrawlerModel,
  MySqlExecutionModel,
  MySqlModelInitializer,
  MySqlRecordModel
} from "./mysql-model";

export class ModelFactory {

  public static async init(): Promise<void> {
    await MySqlModelInitializer.init();
  }

  public static getRecordModel(): IRecordModel {
    return MySqlRecordModel.getInstance();
  }

  public static getExecutionModel(): IExecutionModel {
    return MySqlExecutionModel.getInstance();
  }

  public static getCrawlerModel(): ICrawlerModel {
    return MySqlCrawlerModel.getInstance();
  }
}
