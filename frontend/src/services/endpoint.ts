const env = process.env;

const BACKEND_ADDR = env.REACT_APP_BACKEND_ADDR!;

const OPENAPI_ADDR =
  `http://${BACKEND_ADDR}:${env.REACT_APP_OPENAPI_PORT!}/api/v1`;

export const OPENAPI_REC_ADDR = OPENAPI_ADDR + "/records";

export const OPENAPI_EXE_ADDR = OPENAPI_ADDR + "/executions";

export const GRAPHQL_ADDR =
  `http://${BACKEND_ADDR}:${env.REACT_APP_GRAPHQL_PORT!}/graphql`;
