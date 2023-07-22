# web-crawler

An implementation of web crawler based on the [specification](https://webik.ms.mff.cuni.cz/nswi153/seminar-project.html).

Tech stack: `TypeScript`, `React`, `Redux`, `Node.js`, `MySQL`, `OpenAPI`, `GraphQL`.

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

## References

- https://www.typescriptlang.org/docs/handbook/intro.html
- https://redux-toolkit.js.org/
- https://mui.com/material-ui/getting-started/
- https://github.com/visjs/vis-network
