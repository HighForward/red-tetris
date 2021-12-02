import { Middleware } from '@nuxt/types'

// const isConnected: Middleware = (context) => {
//     // Use context
//     console.log(salut)
// }


const redirect: Middleware = (context) => {
    console.log('coucou')
}

export default redirect
// export default myMiddleware