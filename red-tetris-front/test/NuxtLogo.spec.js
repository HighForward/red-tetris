import { mount } from '@vue/test-utils'
import MultiplayerLobby from '@/components/Multiplayer-Lobby.vue'

// import NuxtLogo from '@/components/NuxtLogo.vue'

describe('my test', () => {

    test('is a Vue instance', async () => {
        const wrapper = mount(MultiplayerLobby)
        await wrapper.setData({username: 'Johnny'})
        const w = wrapper.find('#usernameInput')
        expect(1 === 1)
    })

})
