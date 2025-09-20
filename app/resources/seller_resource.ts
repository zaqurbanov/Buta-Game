import Seller from '#models/seller'
import EntityResource from '#resources/entity_resource'

export default class SellerResource extends EntityResource {
  format(data: Seller) {
    const { id, email,isActive,isVerified } = data
    return {
      id,
      email,
      isActive,
      isVerified,
      ...this.entityData(data),
    }
  }
}
