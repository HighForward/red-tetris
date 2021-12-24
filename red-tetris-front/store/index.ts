import Vue from 'vue'
import Vuex from 'vuex'

import user from '~/store/modules/user'
import lobby from '~/store/modules/lobby'
import board from '~/store/modules/board'

Vue.use(Vuex)

const store = new Vuex.Store({
        modules: {
            user: user,
            lobby: lobby,
            board: board
        }
})

// import { Store } from 'vuex'
// import { initialiseStores } from '~/utils/store-accessor'
// const initializer = (store: Store<any>) => initialiseStores(store)
// export const plugins = [initializer]
// export * from '~/utils/store-accessor'


// import Vuex from 'vuex'
//
// export const store = new Vuex.Store<any>({});