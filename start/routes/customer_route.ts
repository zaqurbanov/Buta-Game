import ContactController from "#controllers/customer/contact_controller"
import { crud } from "#services/utils/helpers"
import router from "@adonisjs/core/services/router"

export const customerRouter = () =>
  router
    .group(() => {
      crud({ controller: ContactController, prefix: 'contacts' })
    //    crud({ controller: SellerController, prefix: 'sellers' })
    })
    .prefix('customers')