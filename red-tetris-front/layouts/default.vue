<template>
	<div class="w-full" style="">
		<Header/>
		<div style="min-height: calc(100vh - 64px); width: 100%; font-family: 'Play', sans-serif;" class="bg-gray">

			<div v-if="this.$socket.connected">
				<div>
					<InfoBoard></InfoBoard>

				</div>
				<div>
					<Nuxt />
				</div>
			</div>
			<div v-else>
				<div class="w-full pt-16 flex items-center justify-center text-smallgray">CONNEXION IMPOSSIBLE</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
import { LobbyInterface, BoardInterface } from '@/types/gametype'
import { Socket } from 'vue-socket.io-extended'
import InfoBoard from '/components/InfoBoard.vue'

const LobbyStore = namespace('modules/lobby')
const BoardStore = namespace('modules/board')
const UserStore = namespace('modules/user')

@Component({
	components: {
		InfoBoard
	}
})
export default class App extends Vue {

	// @user.Getter
	// public fullName!: string

	@LobbyStore.State
	public currentLobby!: LobbyInterface | null

	@LobbyStore.Getter
	public getLobby!: LobbyInterface | null

	@LobbyStore.Mutation
	public updateLobby!: (lobby: LobbyInterface) => void



	@LobbyStore.Getter
	public getLobbyList!: LobbyInterface[]

	@LobbyStore.Mutation
	public setLobbyList!: (lobby: LobbyInterface[]) => void

	@LobbyStore.Mutation
	public addLobbyList!: (lobby: LobbyInterface) => void

	@LobbyStore.Mutation
	public removeLobbyList!: (lobby: LobbyInterface) => void

	@LobbyStore.Mutation
	public updateOneLobbyList!: (lobby: LobbyInterface) => void


	@BoardStore.Getter
	public getBoard!: BoardInterface | null

	@BoardStore.Getter
	public getBoardList!: BoardInterface[]

	@BoardStore.Mutation
	public updateLast10Pieces!: (array: []) => void

	@BoardStore.Mutation
	public removeFirstPiece!: () => void

	@BoardStore.Mutation
	public updateBoard!: (board: BoardInterface) => void

	@BoardStore.Mutation
	public updateBoardList!: (board: BoardInterface[]) => void

	@BoardStore.Mutation
	public updateBoardArray!: (board: number[][]) => void

	@UserStore.Mutation
	public setUsername!: (username: string) => void

	mounted()
	{
		this.$socket.client.connect()
		this.$socket.client.emit('getGuestUsername', null, (username: string) => {
			this.setUsername(username)
		})
	}

	@Socket('newLobby')
	addLobby(newLobby: LobbyInterface)
	{
		this.addLobbyList(newLobby)
	}

	@Socket('removeLobby')
	removeLobby(removedLobby: LobbyInterface)
	{
		this.removeLobbyList(removedLobby)
	}

	@Socket('updateLobbyList')
	updateLobbyList(lobby: LobbyInterface)
	{
		this.updateOneLobbyList(lobby)
	}

	@Socket('updateLobby')
	updateLobbyEvent(lobby: LobbyInterface)
	{
		this.updateLobby(lobby)
	}

	@Socket('startLobby')
	ReceiveStartLobby(lobby: LobbyInterface)
	{
		this.updateLobby(lobby)
		this.$router.push('/game')
	}

	@Socket('updateBoard')
	HandleGameEvent(payload: BoardInterface)
	{
		this.updateBoard(payload)
	}

	@Socket('CurrentBoardStop')
	gameEndEvent(payload: BoardInterface)
	{
		this.updateBoard(null)
		this.$router.push(`/lobby`)

	}

	@Socket('Last10Pieces')
	receiveLast20Pieces(payload: [])
	{
		this.updateLast10Pieces(payload)
	}

	@Socket('blockValidate')
	blockValidate(state: boolean)
	{
		this.removeFirstPiece()
	}

}
</script>

<style>

.border-text
{
	text-shadow: 2px 0 0 #ff0000, -2px 0 0 #ff0000, 0 2px 0 #ff0000, 0 -2px 0 #ff0000, 1px 1px #ff0000, -1px -1px 0 #ff0000, 1px -1px 0 #ff0000, -1px 1px 0 #ff0000;
}

</style>
