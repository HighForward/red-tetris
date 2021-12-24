import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'

import Header from '@/components/Header.vue'
import InfoBoard from '@/components/InfoBoard.vue'
import Mode from '@/pages/mode/index.vue'
import Lobby from '@/pages/lobby/index.vue'


const localVue = createLocalVue();
localVue.use(Vuex);

describe('my test', () => {

    test('Header is a vue instance', () => {
        const wrapper = mount(Header, {
            stubs: {
                NuxtLink: true
            }
        })
        expect(wrapper).toBeTruthy()
    })

    beforeEach(() => {
        jest.useFakeTimers();

    })

    it('Choose mode Page is vue instance', async () => {

        const wrapper = mount(Mode, {
            stubs: {
                NuxtLink: true
            },
        })

        expect(wrapper).toBeTruthy()

        wrapper.setData({pageLoaded: false})
        jest.advanceTimersByTime(200);
        expect(wrapper.vm.pageLoaded).toBe(true)

    })

    let getters
    let store

    beforeEach(async () => {

        getters = {
            getLobby: jest.fn(),
            getLobbyList: jest.fn(),
            getBoard: jest.fn(),
            getUsername: jest.fn()
        };

        store = new Vuex.Store({
            getters,
        })

    })


    it('test Lobby', () => {
        const mounted = jest.fn()

        const wrapper = shallowMount(Lobby, {
            store,
            localVue,
        })

        expect(wrapper).toBeTruthy()
    })

    it('testInfoBoard', () => {
        const wrapper = mount(InfoBoard, {
            stubs: {
                NuxtLink: true
            },
            store, localVue
        })

    })

})
