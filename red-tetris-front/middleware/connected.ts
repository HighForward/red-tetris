import { Middleware } from '@nuxt/types'

// const isConnected: Middleware = (context) => {
//     // Use context
//     console.log(salut)
// }


export let connected: Middleware = (context) => {
    // context.app.$socket.connected
}

// export default connected
// export default myMiddleware