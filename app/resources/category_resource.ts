import Category from '#models/category'
import EntityResource from '#resources/entity_resource'

export default class CategoryResource extends EntityResource {
  format(data: Category) {
    const { id,title, imageUrl,imagePublicId ,parentId, parent, children  } = data
    return {
      id,
      title,
      imageUrl,
      imagePublicId,
      parentId,
      parent,
      children,
      parentName: parent?.title,
      
      ...this.entityData(data),
    }
  }
}
