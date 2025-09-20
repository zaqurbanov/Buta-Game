import ContactController from "#controllers/customer/contact_controller"
import LogosController from "#controllers/admin/logos_controller"
import { crud } from "#services/utils/helpers"
import router from "@adonisjs/core/services/router"
import HeroSectionController from "#controllers/customer/hero_section_controller"

export const customerRouter = () =>
  router
    .group(() => {
      crud({ controller: ContactController, prefix: 'contacts' })
    //    crud({ controller: SellerController, prefix: 'sellers' })
       crud({ controller: LogosController, prefix: 'logo' })
       crud({ controller: HeroSectionController, prefix: 'hero' })


    })
    .prefix('customers')