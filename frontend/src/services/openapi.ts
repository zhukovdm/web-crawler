import {
  ExecutionFullType,
  RecordBaseType,
  RecordFullType,
  RecordIdType
} from "../domain/types";
import {
  OPENAPI_EXE_ADDR,
  OPENAPI_REC_ADDR
} from "./endpoint";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export class OpenApiService {

  private static readonly DEFAULT_MIME = "application/json";

  private static getErrorMessage(res: Response): string {
    return `${res.statusText} (status code ${res.status})`;
  }

  public static getOptions(method: HttpMethod, body: any): RequestInit {
    return {
      method: method,
      headers: {
        "Accept": OpenApiService.DEFAULT_MIME,
        "Content-Type": OpenApiService.DEFAULT_MIME
      },
      body: (body) ? JSON.stringify(body) : undefined
    };
  }

  public static async getAllRecords(): Promise<RecordFullType[]> {
    const res = await fetch(OPENAPI_REC_ADDR, this.getOptions("GET", undefined));
    if (res.status !== 200) {
      throw new Error(OpenApiService.getErrorMessage(res));
    }
    return await res.json();
  }

  public static async createRecord(record: RecordBaseType): Promise<RecordIdType> {
    const res = await fetch(OPENAPI_REC_ADDR, this.getOptions("POST", record));
    if (res.status !== 201) {
      throw new Error(OpenApiService.getErrorMessage(res));
    }
    return await res.json();
  }

  public static async updateRecord(recId: number, record: RecordBaseType): Promise<void> {
    const res = await fetch(`${OPENAPI_REC_ADDR}/${recId}`, this.getOptions("PUT", record));
    if (res.status !== 204) {
      throw new Error(OpenApiService.getErrorMessage(res));
    }
  }

  public static async deleteRecord(recId: number): Promise<void> {
    const res = await fetch(`${OPENAPI_REC_ADDR}/${recId}`, this.getOptions("DELETE", undefined));
    if (res.status !== 204) {
      throw new Error(OpenApiService.getErrorMessage(res));
    }
  }

  public static async getAllExecutions(): Promise<ExecutionFullType[]> {
    const res = await fetch(OPENAPI_EXE_ADDR, this.getOptions("GET", undefined));
    if (res.status !== 200) {
      throw new Error(OpenApiService.getErrorMessage(res));
    }
    return await res.json();
  }

  public static async createExecution(recId: number): Promise<void> {
    const res = await fetch(OPENAPI_EXE_ADDR, this.getOptions("POST", { recId: recId }))
    if (res.status !== 204) {
      throw new Error(OpenApiService.getErrorMessage(res));
    }
  }
}
