import Customer from "#models/customer";
import EntityResource from "#resources/entity_resource";

export default class CustomerResource extends EntityResource {
    format(data: Customer) {
        return {
            "id": data.id,
            email: data.email,
            ...this.entityData(data)
        }
    }
}
