import Hero_section from '#models/hero_section'
import EntityResource from '#resources/entity_resource'

export default class HeroSectionResource extends EntityResource {
  format(data: Hero_section) {
    const { id, publicId, url, name } = data
    return {
      id,
      publicId,
      url,
      name,
      ...this.entityData(data),
    }
  }
}
