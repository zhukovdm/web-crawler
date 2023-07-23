const env = process.env;

const BACKEND_ADDR = env.REACT_APP_BACKEND_ADDR ?? "localhost";

const OPENAPI_ADDR =
  `http://${BACKEND_ADDR}:${env.REACT_APP_OPENAPI_PORT ?? "3000"}/api/v1`;

export const OPENAPI_REC_ADDR = OPENAPI_ADDR + "/records";

export const OPENAPI_EXE_ADDR = OPENAPI_ADDR + "/executions";

export const GRAPHQL_ADDR =
  `http://${BACKEND_ADDR}:${env.REACT_APP_GRAPHQL_PORT ?? "4000"}/graphql`;

export function getErrorMessage(res: Response): string {
  return `${res.statusText} (status code ${res.status})`;
}
