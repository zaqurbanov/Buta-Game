import {FieldContext} from '@vinejs/vine/types'
import vine from "@vinejs/vine";
import db from "@adonisjs/lucid/services/db";

type TableFilter = { field: string, value: any };

type Options = {
  table: string,
  column: string,
  filters: Array<TableFilter>,
  ignoreId?: string
}

async function uniqueWithFilter(
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
  if(options.ignoreId){
    query.whereNot('id',options.ignoreId);
  }
  const unique = await query.first();
  if (unique) {
    return field.report(
      `The {{ field }} exits in ${options.table} with ${options.column}`,
      'uniqueWithFilter',
      field
    )
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const uniqueWithFilterRule = vine.createRule(uniqueWithFilter)
