import ContactController from "#controllers/admin/contact_controller"
import { crud } from "#services/utils/helpers"
import router from "@adonisjs/core/services/router"

export const adminRouter = () =>
  router
    .group(() => {
      crud({ controller: ContactController, prefix: 'contacts' })
    //    crud({ controller: SellerController, prefix: 'sellers' })
    })
    .prefix('admin')