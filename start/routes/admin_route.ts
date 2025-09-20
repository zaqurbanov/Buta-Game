import ContactController from "#controllers/admin/contact_controller"
import SellerController from "#controllers/admin/seller_controller"
import LogosController from "#controllers/admin/logos_controller"
import { crud } from "#services/utils/helpers"
import router from "@adonisjs/core/services/router"
import HeroSectionController from "#controllers/admin/hero_section_controller"
import CategoryController from "#controllers/admin/category_controller"

export const adminRouter = () =>
  router
    .group(() => {
      crud({ controller: ContactController, prefix: 'contacts' })
       crud({ controller: SellerController, prefix: 'sellers' })
       crud({ controller: LogosController, prefix: 'logo' })
       crud({ controller: HeroSectionController, prefix: 'hero' })
       crud({ controller: CategoryController, prefix: 'category' })



    })
    .prefix('admin')