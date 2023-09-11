import { it, describe, expect } from "bun:test";
import { insert } from "./sqlUtils";
import { SQLQuery } from "./sqlQuery";
import { sql } from "./sql";

const db = {
  query: async (queryStr: SQLQuery, tags: any) => {
    return {
      rows: [],
      rowCount: 0,
    };
  },
  transact: async (callback: () => Promise<any>) => {
    return await callback();
  },
};

describe("sql insert() helper", () => {
  it("writes a correct query", () => {
    expect(insert("bob", { foo: "bar", baz: 5 })).toStrictEqual([
      "INSERT INTO bob (foo,baz) VALUES ($1,$2) RETURNING *",
      ["bar", 5],
    ]);
  });
  it("works on multi-insert", () => {
    expect(
      insert("bob", [
        { foo: "bar", baz: 5 },
        { foo: "bar1", baz: 6 },
      ])
    ).toStrictEqual([
      "INSERT INTO bob (foo,baz) VALUES ($1,$2),($3,$4) RETURNING *",
      ["bar", 5, "bar1", 6],
    ]);
  });
  it("work on json", () => {
    expect(insert("bob", { foo: "bar", baz: { a: 1, b: 2 } })).toStrictEqual([
      "INSERT INTO bob (foo,baz) VALUES ($1,$2) RETURNING *",
      ["bar", { a: 1, b: 2 }],
    ]);
  });
});

describe("sql tag template", function () {
  it("returns a SqlQuery Object", function () {
    let s = sql`hello`;
    expect(s).toBeInstanceOf(SQLQuery);
  });
  it("Has no values", function () {
    let s = sql`hello`;
    expect(s._repr).toBe("hello");
    expect(s._values.length).toBe(0);
  });
  it("writes the correct query if it has a value", function () {
    let there = "there";
    let s = sql`hello ${there}`;
    expect(s._repr).toBe("hello $?");
    expect(s._values).toEqual(["'there'"]);
  });
  it("Merges literals", function () {
    let there = "there";
    let s = sql`hello :${there}`;
    expect(s._values.length).toBe(0);
    expect(s._repr).toBe("hello there");
  });
  it("strips all literal whitespace", function () {
    expect(sql`SELECT       \n * \n FROM          table`.render()).toBe(
      "SELECT * FROM table"
    );
  });
  it("doesnt strip whitespace in variables (user input)", function () {
    let userInput =
      "Some string\nWith whitespace.    With Formating    that is   \n  just right";
    expect(sql`INSERT \n into table (vals) VALUES(${userInput})`.render()).toBe(
      `INSERT into table (vals) VALUES('${userInput}')`
    );
  });
  it("writes the correct query with literals", function () {
    let column = "f18209eri_label";
    let dataset = "ds.defu1920";
    expect(sql`SELECT id, :${column} FROM :${dataset}`.render()).toBe(
      "SELECT id, f18209eri_label FROM ds.defu1920"
    );
  });
  it("writes the correct query with values", function () {
    let val = 1;
    let val2 = "f";
    expect(sql`SELECT * FROM table WHERE a=${val} and b=${val2}`.render()).toBe(
      "SELECT * FROM table WHERE a=1 and b='f'"
    );
  });
  it("writes the correct query with array values", function () {
    let val = ["a", "b", "c"];
    expect(sql`INSERT into table (vals) VALUES(${val})`.render()).toBe(
      `INSERT into table (vals) VALUES('{"a","b","c"}')`
    );
  });
  it("writes the correct query with a literal and a value", function () {
    let column = "f18209eri_label";
    let dataset = "ds.defu1920";
    let val = 1;
    let val2 = "f";

    expect(
      sql`SELECT id,:${column} FROM :${dataset} WHERE a=${val} and b=${val2}`.render()
    ).toBe("SELECT id,f18209eri_label FROM ds.defu1920 WHERE a=1 and b='f'");
  });
  it("writes the correct query with an embedded sql-string", function () {
    let column = "f18209eri_label";
    let dataset = "ds.defu1920";
    let val = 1;
    let val2 = "f";
    let where = sql`WHERE a=${val} and b=${val2}`;

    expect(sql`SELECT id,:${column} FROM :${dataset} ${where}`.render()).toBe(
      "SELECT id,f18209eri_label FROM ds.defu1920 WHERE a=1 and b='f'"
    );
  });
  it("writes the correct query with an values filtered", function () {
    let column = "f18209eri_label";
    let dataset = "ds.defu1920";
    let val = 1;
    let val2 = "f";
    let where = sql`WHERE a=${val} and b=${val2}`;
    expect(sql`SELECT id,:${column} FROM :${dataset} ${where}`.toString()).toBe(
      "SELECT id,f18209eri_label FROM ds.defu1920 WHERE a=$1 and b=$2"
    );
  });
  it("writes the correct query with an embedded sql-string at beginning", function () {
    let column = "f18209eri_label";
    let dataset = "ds.defu1920";
    let val = 1;
    let val2 = "f";
    let select = sql`SELECT id,:${column} FROM `;
    let where = sql`WHERE a=${val} and b=${val2}`;

    expect(sql`${select}:${dataset} ${where}`.render()).toBe(
      "SELECT id,f18209eri_label FROM ds.defu1920 WHERE a=1 and b='f'"
    );
  });

  describe("prevents sql injection", function () {
    it("doesn't allow injection in literals", function () {
      expect(function () {
        let column = "f12344 OR 1=1";
        sql`SELECT :${column}`;
      }).toThrow();
    });
    it("doesn't allow injection in values", function () {
      let val = "abc' OR 1=1;--";
      expect(sql`SELECT * from tables WHERE col=${val}`.render()).toBe(
        "SELECT * from tables WHERE col='abc'' OR 1=1;--'"
      );
    });
    it("doesn't allow injection in number values", function () {
      let val = "105 OR 1=1;--";

      expect(sql`SELECT * from tables WHERE col=${val}`.render()).toBe(
        "SELECT * from tables WHERE col='105 OR 1=1;--'"
      );
    });
  });
  describe("Actual check to make sure no sql injection @slow", function () {
    it("should return 0 rows", async function () {
      let val = "pg_authid' OR 1=1";
      let q = sql`SELECT * from pg_catalog.pg_tables WHERE tablename=${val}`;
      let results = await db.query(q, { application: "tests" });
      expect(results.rowCount).toBe(0);
    });
  });

  describe("helper functions", () => {
    it("merge() works", async () => {
      let andTestInjection = "pg_authid' OR 1=1";
      const queries = [
        sql`test`,
        sql`:${"nice"}`,
        sql`${123}`,
        sql`AND ${andTestInjection}`,
      ];
      const query = sql.merge(queries, sql`, `);

      expect(query.render()).toBe("test, nice, 123, AND 'pg_authid'' OR 1=1'");
    });
    it("merge() works with empty array", async () => {
      const queries: SQLQuery[] = [];
      const query = sql.merge(queries);

      expect(query.render()).toBe("");
    });
    it("values() works with object", async () => {
      const values = {
        a: 1,
        b: "abc",
      };
      const query = sql`INSERT INTO test ${sql.values(values)}`;

      expect(query.render()).toBe("INSERT INTO test (a,b) VALUES (1,'abc')");
    });
    it("insert() works with object", async () => {
      const values = {
        a: 1,
        b: "abc",
      };
      const query = sql.insert("test", values);

      expect(query.render()).toBe(
        "INSERT INTO test (a,b) VALUES (1,'abc') RETURNING *"
      );
    });
    it("values() works with array", async () => {
      const values = [
        {
          a: 1,
          b: "abc",
        },
        {
          a: 2,
          b: "def",
        },
      ];
      const query = sql`INSERT INTO test ${sql.values(values)}`;

      expect(query.render()).toBe(
        "INSERT INTO test (a,b) VALUES (1,'abc'),(2,'def')"
      );
    });
  });
  it("setters() works", async () => {
    const values = {
      a: 1,
      b: "abc",
    };

    const query = sql`UPDATE test SET ${sql.setters(values)}`;

    expect(query.render()).toBe("UPDATE test SET a=1,b='abc'");
  });
  it("setters() works with json values", async function () {
    const values = {
      a: "Bob's burgers",
      b: { some: "json", thing: true },
    };
    const query = sql`UPDATE test SET ${sql.setters(values)}`;

    expect(query.render()).toBe(
      "UPDATE test SET a='Bob''s burgers',b='{\"some\":\"json\",\"thing\":true}'"
    );
  });
  it("basicUpdate() works", async () => {
    const values = {
      a: 1,
      b: "abc",
    };

    const query = sql.basicUpdate("test", values, "1");

    expect(query.render()).toBe("UPDATE test SET a=1,b='abc' WHERE id='1'");
  });
  it("basicSelect() works", async () => {
    const query = sql.basicSelect("test", {
      columns: ["one", "two"],
      ids: ["a", "b", "c"],
    });
    expect(query.render()).toBe(
      "SELECT one,two FROM test WHERE id IN ('a','b','c')"
    );
  });
  it("select with multiple conditions with IN", async () => {
    const ids = ["a", "b", "c"];
    expect(sql`SELECT * FROM test WHERE id IN @${ids}`.render()).toBe(
      "SELECT * FROM test WHERE id IN ('a','b','c')"
    );
  });
});
