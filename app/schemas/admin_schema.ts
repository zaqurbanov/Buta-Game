import vine from '@vinejs/vine'
import { uniqueWithFilterRule } from '#schemas/rules/unique_with_filter'
export const saveContactSchema = (ignoreId?: string) => vine.object({
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

export const saveLogoSchema =
  vine.compile(
    vine.object({
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'svg', 'gif']
    })
  }))

  export const saveHeroSectionSchema = vine.compile(
    vine.object({
    images: vine.array(vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'svg', 'gif']
    }))
  }))

  export const saveCategorySchema = vine.compile(
    vine.object({
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'svg', 'gif']
    }).optional(),
    title: vine.string().minLength(3),
    parentId: vine.string().optional(),



  }))
