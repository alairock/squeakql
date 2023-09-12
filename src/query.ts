import { isDate } from "../ts-utils";

export class SqueakqlQuery {
  _repr: string;
  _values: string[];

  constructor(literals: readonly string[], values: any[]) {
    this._repr = "";
    this._values = [];

    if (values.includes(undefined)) {
      throw new TypeError('SQL string cannot include "undefined" value.');
    }
    for (let i = 0; i < literals.length; i++) {
      let str = literals[i];
      let val = values[i];
      if (str.slice(-1) === ":") {
        // val needs to be a literal
        val = SqueakqlQuery.validateLiteral(val);
        this._repr += str.slice(0, -1) + val;
      } else {
        let tupleNotation = false;
        if (str.slice(-1) === "@") {
          tupleNotation = true;
          str = str.slice(0, -1);
        }
        // val contains user input
        this._repr += str;
        if (val !== undefined) {
          this._repr += this._addVal(val, tupleNotation);
        }
      }
    }
  }

  static validateLiteral(val: string | SqueakqlQuery) {
    if (val instanceof SqueakqlQuery) {
      if (val._values.length != 0) {
        throw new TypeError(
          "Cannot turn nested sql tag template into a " +
            "literal because it contains values"
        );
      }
      return val._repr;
    }
    if (typeof val !== "string") {
      throw new TypeError(`Type ${typeof val} not supported for sql literals.`);
    } else {
      // should only contain word characters
      if (!/^[\w.*\s]+$/.test(val)) {
        throw new TypeError(
          `SQL literals can only contain word characters (a-Z0-9_\\s.). You gave ${val}`
        );
      }
      return val;
    }
  }

  render(): string {
    return this._internalRender();
  }

  toString(): string {
    return this._internalRender(true);
  }

  private _internalRender(filtered = false): string {
    let count = 0;
    return this._repr
      .replace(/\s+/g, " ")
      .replace(/\$\?/g, () => {
        const str = filtered ? `$${count + 1}` : this._values[count];
        count++;
        return str;
      })
      .trim();
  }

  public replace(str: string, result: string) {}

  private static _escapeVal(val: any) {
    let val_string;
    if (Array.isArray(val)) {
      val_string = JSON.stringify(val).slice(1, -1);
    } else {
      val_string = val.toString();
    }
    let v = val_string.split("'").join("''");
    return `'${v}'`;
  }

  private _sqlizeValue(val: any, tupleNotation: boolean): string {
    if (val === null) {
      return "NULL";
    } else if (isDate(val)) {
      return `to_timestamp(${+val / 1000})`;
    } else if (["number"].includes(typeof val)) {
      return val;
    } else if (Array.isArray(val)) {
      if (tupleNotation) {
        return `(${val
          .map((v) => this._sqlizeValue(v, tupleNotation))
          .toString()})`;
      } else {
        return `'{${SqueakqlQuery._escapeVal(val).slice(1, -1)}}'`;
      }
    } else if (typeof val === "object") {
      return SqueakqlQuery._escapeVal(JSON.stringify(val));
    } else {
      return SqueakqlQuery._escapeVal(val);
    }
  }

  private _addVal(val: any, tupleNotation = false) {
    if (val instanceof SqueakqlQuery) {
      for (const v of val._values) {
        this._values.push(v);
      }
      return val._repr;
    }
    const sqlizedValue = this._sqlizeValue(val, tupleNotation);
    this._values.push(sqlizedValue);
    return "$?";
  }
}
