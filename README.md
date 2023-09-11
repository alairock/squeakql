# Squeakql: The Fluent SQL Builder for JavaScript

Squeakql is a SQL query builder and utility library that combines best practices, security, and a fluent API for effortlessly building SQL queries. Optimized for TypeScript, Squeakql is designed to be simple, efficient, and powerful, making database interactions more robust and developer-friendly.

## Features

- Type Safety: Full TypeScript support for static type checking.
- Fluent API: Effortlessly chain methods to build SQL queries.
- SQL Injection Prevention: Enhanced security measures to protect against SQL injections.
- String Interpolation: Utilize JavaScript template literals for cleaner code.
- Built-In Helper Functions: Easily insert, update, and select records with minimal code.

## Quickstart

### installation

```sh
bun add squeakql
# or
npm install squeakql
```

### quick usage

```js
import { sql } from "squeakql";

const query = sql`SELECT * FROM users WHERE id=${userId}`;
```

## API Highlights

### SQL Insert Helper

```js
const [queryStr, values] = insert("users", { username: "johndoe", age: 25 });
```

Generates: `INSERT INTO users (username, age) VALUES ($1, $2) RETURNING *`

### Template Tag

Squeakql uses template string literals to interpolate values safely preventing sql injection while allowing you to write readable sql!

```js
const query = sql`SELECT * FROM table WHERE a=${val} and b=${val2}`;
```

#### Example SQL Injections prevention

Squeakql protects against SQL injections both in literals and values.

```js
injectCode = "abc' OR 1=1;--";
const query = sql`SELECT * from tables WHERE col=${injectCode}`.render();
```

Will return a properly escaped query:

> SELECT \* from tables WHERE col='abc'' OR 1=1;--'

## sql helpers

- insert(table: string, vals: Dictionary|Dictionary[], ignorConflict = false)
- update(table: string, vals: Dictoinary, id: string)
- sql.basicSelect()
- sql.unsafe()
- sql.merge()
- sql.values()
- sql.setters()
- sql.columns()
- sql.insert()
- sql.basicUpdate()
- sql.updateMany()

## Query Builder
