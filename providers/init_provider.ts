import type { ApplicationService } from '@adonisjs/core/types'
import BootstrapApp from '#bootstrap/bootstrap_app'


export default class InitProvider {
  private bootstrapApp: BootstrapApp;
  constructor(protected app: ApplicationService) {
    this.bootstrapApp = new BootstrapApp();
  }

  /**
   * Register bindings to the container
   */
  register() {
    this.bootstrapApp.registerApp(this.app);
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    import("../start/extension.js");
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
