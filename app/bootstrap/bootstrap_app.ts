import {ApplicationService} from "@adonisjs/core/types";
import ValidatorService from "#services/core/validator_service";
import BaseValidatorService from "#contracts/services/base_validator_service";

export default class BootstrapApp {
  registerApp(app: ApplicationService) {
    app.container.singleton(BaseValidatorService, async () => app.container.make(ValidatorService));
  }
}
