import Contact from '#models/contact'
import EntityResource from '#resources/entity_resource'

export default class ContactResource extends EntityResource {
  format(data: Contact) {
    const { id, key, value, href } = data
    return {
      id,
      key,
      value,
      href,
      ...this.entityData(data),
    }
  }
}
