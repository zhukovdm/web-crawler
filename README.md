# web-crawler

An implementation of web crawler based on the [specification](https://webik.ms.mff.cuni.cz/nswi153/seminar-project.html).

Tech stack: `TypeScript`, `React`, `Redux`, `Express`, `Node.js`, `OpenAPI`, `GraphQL`, `MySQL`, `Docker`.

## Deployment

Run the following commands:

```bash
git clone https://gitlab.mff.cuni.cz/zhukovd/web-crawler.git
cd web-crawler/ && docker compose up
```

The application consists of four components.

| Component         | URL                           |
|-------------------|-------------------------------|
| React frontend    | http://localhost:3000         |
| OpenAPI backend   | http://localhost:3001         |
| GraphQL backend   | http://localhost:3002/graphql |
| MySQL database    | http://localhost:3306/        |

The deployment procedure uses healthchecks to ensure the components are started in an acceptable order. `MySQL`
database could become available before the instance is initialized (see [init.sql](./database/init/init.sql) file).
There is no clear approach in `Docker` how to postpone container start once all dependencies are healthy. An example
of an early start is presented at [early-start.log](./tests/early-start.log).

## User interface

![hom.png](./docs/assets/pics/hom.png)

![rec.png](./docs/assets/pics/rec.png)

![exe.png](./docs/assets/pics/exe.png)

![vis.png](./docs/assets/pics/vis.png)

## References

- https://www.typescriptlang.org/docs/handbook/intro.html
- https://redux-toolkit.js.org/
- https://mui.com/material-ui/getting-started/
- https://github.com/visjs/vis-network
