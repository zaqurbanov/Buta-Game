import Logo from '#models/logo'
import EntityResource from '#resources/entity_resource'

export default class LogoResource extends EntityResource {
  format(data: Logo) {
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
