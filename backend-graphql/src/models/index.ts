import { IModel } from "../domain/interfaces";
import { MySqlModel } from "./mysql-model";

export class ModelFactory {

  public static getModel(): IModel { return new MySqlModel(); }
}
