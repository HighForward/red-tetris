import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { UserInterface, LobbyInterface } from '@/types/gametype'

@Module({
    namespaced: true,
    name: 'lobby',
    stateFactory: true,
})
export default class Lobby extends VuexModule {

    public currentLobby: LobbyInterface | null = null

    public lobbyList: LobbyInterface[] = []

    get getLobby(): LobbyInterface | null {
        return this.currentLobby ? this.currentLobby : null
    }

    get getLobbyList(): LobbyInterface[] {
        return this.lobbyList
    }

    @Mutation
    updateLobby(lobby: LobbyInterface | null) : void{
        this.currentLobby = lobby
    }

    @Mutation
    addLobbyChatMessage(msg: string) : void{

        this.currentLobby?.chat.push(msg)
    }

    @Mutation
    setLobbyList(lobbyList: LobbyInterface[]) : void {
        this.lobbyList = lobbyList
    }

    @Mutation
    addLobbyList(lobby: LobbyInterface)
    {
        this.lobbyList.push(lobby)
    }

    @Mutation
    removeLobbyList(removedLobby: LobbyInterface)
    {
        const index = this.lobbyList.findIndex((lobby: LobbyInterface) => { return lobby.uid === removedLobby.uid })
        if (index !== -1)
            this.lobbyList.splice(index, 1)
    }

    @Mutation
    updateOneLobbyList(lobby: LobbyInterface)
    {
        let pivot = this.lobbyList.find((tmp) => tmp.uid === lobby.uid)

        // const lobby_swap: LobbyInterface = {
        //     players: lobby.players
        // }

        if (pivot) {
            pivot.players = lobby.players
            pivot.state = lobby.state
            pivot.owner = lobby.owner
            pivot.uid = lobby.uid
            pivot.name = lobby.name
        }
    }
}