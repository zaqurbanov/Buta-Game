import BaseValidatorService from "#contracts/services/base_validator_service";
import vine from "@vinejs/vine";

export default class ValidatorService extends BaseValidatorService {
  async validate(schema: any, data: object): Promise<void> {
    return await vine.validate({
      schema,
      data
    });
  }
}
