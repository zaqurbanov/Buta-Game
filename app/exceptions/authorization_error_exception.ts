import { Exception } from '@adonisjs/core/exceptions'

export default class AuthorizationErrorException extends Exception {
  static status = 401
}