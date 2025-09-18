import vine from '@vinejs/vine'
import { uniqueWithFilterRule } from '#schemas/rules/unique_with_filter'
export const saveContactSchema = (ignoreId?:string)=>vine.object({
  key: vine.string().use(
      uniqueWithFilterRule({
        table: 'contacts',
        column: 'key',
        filters: [],
        ignoreId: ignoreId,
      })
    ),
  value: vine.string(),
  href: vine.string(),
})
