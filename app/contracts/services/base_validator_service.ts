export default abstract class BaseValidatorService {
  abstract validate(payload:object,data:object) : Promise<void>;
}
