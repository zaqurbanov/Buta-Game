// import emitter from '@adonisjs/core/services/emitter'

// emitter.on('db:query', function (query) {
//   console.log(query);
// })

declare module '@adonisjs/core/http' {


  export interface HttpContext {
    userId?: number,
    fullName?: string,
  }
}
