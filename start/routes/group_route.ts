import router from '@adonisjs/core/services/router'
import {authRouter, userRouter} from "#start/routes/auth_route";
import { adminRouter } from '#start/routes/admin_route';
import { customerRouter } from '#start/routes/customer_route';


export const publicRouter = () =>
    router.group(() => {
        authRouter()
        customerRouter()
    })

export const protectedRouter = () => {
    router
        .group(() => {
            userRouter()
            adminRouter()
        })
        // .middleware([middleware.auth()])
}
