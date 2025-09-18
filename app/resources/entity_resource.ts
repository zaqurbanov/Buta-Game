import BaseResource from "#contracts/resource/base_resource";
import EntityModel from "#models/entity_model";

export default abstract class EntityResource extends BaseResource {
  entityData(data: EntityModel) {
    return {
      "createdAt": data.createdAt,
      "updatedAt": data.updatedAt,
    }
  }
}
