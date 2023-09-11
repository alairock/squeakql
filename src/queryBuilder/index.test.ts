import { it, describe, expect } from "bun:test";
import { RecordQueryBuilder } from ".";
import { sql } from "../sql";

function newQueryBuilder() {
  return new RecordQueryBuilder("test");
}

describe("RecordQueryBuilder", () => {
  it("constructor() works", async () => {
    const qb = newQueryBuilder();
    expect(qb.baseTable.alias).toBe("t");
    expect(qb.baseTable.tableName).toBe("test");

    // add where clauses and check
    const one = "1";
    const two = "2";
    const nqb = newQueryBuilder();
    nqb.addWhereClause(sql`a = ${one}`);
    nqb.addWhereClause(sql`b = ${two}`);
    expect(nqb.compile().render()).toBe(
      "SELECT t.* FROM ONLY test AS t WHERE (a = '1') AND (b = '2')"
    );

    // add having clauses and check
    const three = "3";
    const four = "4";
    const havingQb = newQueryBuilder();
    havingQb.addHavingClause(sql`c = ${three}`);
    havingQb.addHavingClause(sql`d = ${four}`);
    expect(havingQb.compile().render()).toBe(
      // TODO: This is bad, because you need a group by to have a having
      "SELECT t.* FROM ONLY test AS t HAVING (c = '3') AND (d = '4')"
    );

    // add order bys and check
    const orderByQb = newQueryBuilder();
    orderByQb.addOrderBy(sql`e`);
    orderByQb.addOrderBy(sql`f`);
    expect(orderByQb.compile().render()).toBe(
      "SELECT t.* FROM ONLY test AS t ORDER BY e,f"
    );

    // add group bys and check
  });
});
