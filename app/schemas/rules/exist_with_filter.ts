import {FieldContext} from '@vinejs/vine/types'
import vine from "@vinejs/vine";
import db from "@adonisjs/lucid/services/db";

type TableFilter = { field: string, value: any };

type Options = {
  table: string,
  column: string,
  filters: Array<TableFilter>
}

async function existsWithFilter(
  value: unknown,
  options: Options,
  field: FieldContext
) {
  if (!value) {
    return;
  }
  const filter: string = value ? value.toString() : '';
  const query = db.from(options.table).select('id').where(options.column, filter);
  for (const filter of options.filters) {
    query.where(filter.field, filter.value)
  }
  const exists = await query.first();
  if (!exists) {
    return field.report(
      `The {{ field }} not exits in ${options.table} with ${options.column}`,
      'existsWithFilter',
      field
    )
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const existsWithFilterRule = vine.createRule(existsWithFilter)
