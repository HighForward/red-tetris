<template>
	<div class="w-full">
		<div class="flex justify-center w-full font-semibold">
			<div class="mt-12 flex flex-row" style="width: 900px; box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);">

				<div class="gamesList flex flex-col flex-1 p-2 m-2 border rounded" style="border-color: #DDDDDD">
					<h1 class="text-center text-orange my-2" style="">LISTE DES PARTIES</h1>
					<div style="overflow-y: scroll; height: 200px">
						<div class="flex flex-col" style="color: #DDDDDD;" v-for="lobby of this.getLobbyList">
							<div class="p-1 px-2 flex flex-row justify-between hover:bg-smallgray rounded-lg hover:text-red">

								<div class="flex flex-row items-center LobbyFront" style="height: 28px">
									<div>{{ lobby.name }}</div>
									<img v-if="lobby.owner.id === $socket.client.id" src="@/assets/images/couronne.png" alt="">
									<img v-if="lobby.players.find((p) => { return p.id === $socket.client.id })" src="@/assets/images/user.png" alt="">
								</div>

								<div>
									<span>[{{ lobby.state }}]</span>
									<span>{{'[' + lobby.players.length + '/8]'}}</span>
									<button @click="joinLobby(lobby)" class="bg-red rounded-lg px-2" style="color: whitesmoke">rejoindre</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div>
					<div class="gamesList flex flex-col flex-1 p-2 m-2 border rounded" style="border-color: #DDDDDD">
						<h1 class="text-center text-orange my-2" style="">CREER UNE PARTIES</h1>
						<form @submit.prevent="createGame" class="flex items-center flex-col w-full">
							<input v-model="gameName" id="usernameInput" style="width: 300px" type="text" class="text-center rounded-sm px-2 py-1 m-4" placeholder="Nom de la partie">
							<button class="buttonMulti flex flex-row justify-around px-12 py-2 mb-2" style="">
								<img class="imgTetrisMulti" src="@/assets/images/Tetromino_Z.svg">
								<div class="font-semibold text-red">Créer la partie</div>
								<img class="imgTetrisMulti" src="@/assets/images/Tetromino_Z.svg">
							</button>
						</form>
					</div>
				</div>
      </div>
		</div>
	</div>
</template>


<script lang="ts">
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
import { Socket } from 'vue-socket.io-extended'
const UserStore = namespace('modules/user')
const LobbyStore = namespace('modules/lobby')

import { LobbyInterface, ErrorInterface} from '@/types/gametype'


@Component({components: {
	}
})
export default class MultiplayerLobby extends Vue {

	gameName: string = ""
	// lobbies: LobbyInterface[] = []

	mounted()
	{
		this.$socket.client.emit('getLobbies', null, (lobbiesDto: LobbyInterface[]) => {
			// this.lobbies = lobbiesDto
			this.setLobbyList(lobbiesDto)
		})
	}

	@UserStore.Getter
	public getUsername!: string

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


	getIntoLobbyAction(lobbyDto: LobbyInterface | ErrorInterface)
	{
		if (!lobbyDto || (lobbyDto as ErrorInterface).error) {
			this.$toast.error(`${(lobbyDto as ErrorInterface).error}`)
		}
		else {
			this.updateLobby(lobbyDto as LobbyInterface)
			this.$router.push(`/lobby`)
		}
	}

	async createGame()
	{
		if (!this.gameName || (this.gameName.length < 3 || this.gameName.length > 14))
			this.$toast.error('Le nom choisit est invalide')
		else
			this.$socket.client.emit('createLobby', this.gameName, (lobbyDto: LobbyInterface | ErrorInterface ) => {

				this.getIntoLobbyAction(lobbyDto)
			})
	}

	joinLobby(lobby: LobbyInterface)
	{
		this.$socket.client.emit('joinLobby', lobby.uid, (lobbyDto: LobbyInterface | ErrorInterface) => {

			this.getIntoLobbyAction(lobbyDto)
		})
	}
}

</script>

<style>

.buttonMulti:hover .imgTetrisMulti
{
	transform: rotate(380deg);
}

.imgTetrisMulti {
	@apply object-contain;
  width: 75px;
  height: 30px;
	transition: all 0.3s ease-in-out 0s;
}

.gamesList {
	width: 400px;
}

.LobbyFront img
{
	width: 28px;
	height: 28px;
	margin-left: 4px;
}

</style>
