import { Exception } from '@adonisjs/core/exceptions'

export default class BadException extends Exception {
  static status = 400
}
