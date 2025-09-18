import router from '@adonisjs/core/services/router'
import {protectedRouter, publicRouter} from "#start/routes/group_route";

router
    .group(() => {
        publicRouter()
        protectedRouter()
    })

    .prefix('/api/v1')
