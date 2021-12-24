<template>
	<div v-if="this.getLobby && this.getLobby.players" class="bg-gray" style="box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);">
		<div class="rounded-sm pb-4 px-2">
			<div class="flex justify-center py-2 font-semibold text-2xl text-orange">{{ this.getLobby.name }}</div>

			<div class="flex flex-row">
				<div class="flex flex-col">

					<div class="lobbyRow flex flex-col flex-1 p-2 m-2 border rounded" style="border-color: #DDDDDD">
						<h1 class="text-center text-orange" style="">LISTE DES JOUEURS</h1>
						<div class="flex flex-col" style="color: #DDDDDD" v-for="player of this.getLobby.players">
							<div>- <span :class="player.id === getLobby.owner.id ? 'text-orange' : ''" class="text-purple ml-1">{{ player.username }}</span></div>
						</div>
						<div v-for="n in (8 - getLobby.players.length)">
							<div style="color: #DDDDDD">-</div>
						</div>
					</div>
					<div class="lobbyRow flex flex-1 m-2 border rounded" style="border-color: #DDDDDD">
						<form @submit.prevent="sendMessage" class="flex justify-end border-black flex-col font-normal w-full">
							<div class="p-1" style="overflow-y: scroll; height: 125px">
							<div class="text-sm" style="color: #DDDDDD" v-for="msg of getLobby.chat">
								<div>{{ msg }}</div>
							</div>
							</div>
							<input v-model="message" class="pl-1" type="text">
						</form>
					</div>
				</div>


				<div class="lobbyRow flex flex-1 flex-col">
					<div class="m-2 p-2 border rounded" style="border-color: #DDDDDD">
						<h1 class="text-center text-orange">GAME RULES</h1>
						<div class="flex flex-col font-normal text-smallgray" style="color: #DDDDDD">
							<div class="flex flex-row justify-between"><span>map</span><span class="text-purple">Tetris</span></div>
							<div class="flex flex-row justify-between"><span>board</span><span class="text-purple">20 x 10</span></div>
							<div class="flex flex-row justify-between"><span>players</span><span class="text-purple">{{ this.getLobby.players.length }}</span></div>
							<div class="flex flex-row justify-between"><span>gamemode</span><span class="text-purple">Battle Royal</span></div>
							<div class="flex flex-row justify-between"><span>state</span><span class="text-purple">{{ this.getLobby.state }}</span></div>
							<div class="flex flex-row justify-between"><span>uid</span><span class="text-purple">{{ this.getLobby.uid }}</span></div>
							<div class="flex flex-row justify-between"><span>owner</span><span class="text-purple">{{ this.getLobby.owner.username }}</span></div>

						</div>
					</div>
					<div class="flex flex-1 flex-col">
						<div class="m-2 p-2">
							<h1 class="text-center text-orange">OPTIONS</h1>
							<div class="flex flex-row justify-around my-4">
								<img class="imgTetromino" src="@/assets/images/Tetromino_J.svg">
								<img class="imgTetromino" src="@/assets/images/Tetromino_Z.svg">
								<img class="imgTetromino" src="@/assets/images/Tetromino_T.svg">
								<img @click="leaveLobby" class="imgTetromino" src="@/assets/images/Tetromino_S.svg">
							</div>
						</div>

					</div>
					<div class="flex flex-1 flex-col justify-end m-2">
						<button @click="startLobby" class="bg-gradient-to-r from-orange to-pink border-4 border-black font-bold" >START GAMES</button>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>


<script lang="ts">
import {Component, Prop, Vue, namespace} from 'nuxt-property-decorator'
import {Socket} from 'vue-socket.io-extended'
import {ErrorInterface, LobbyInterface} from '@/types/gametype'

const LobbyStore = namespace('modules/lobby')

@Component({})
export default class Lobby extends Vue {

	message: string = ""

	@LobbyStore.Getter
	public getLobby!: LobbyInterface | null

	@LobbyStore.Mutation
	public updateLobby!: (lobby: LobbyInterface | null) => void

	@LobbyStore.Mutation
	public addLobbyChatMessage!: (msg: string) => void

	leaveLobby()
	{
		if (this.getLobby)
		{
			this.$socket.client.emit('leaveLobby', this.getLobby.uid, (lobby: LobbyInterface | ErrorInterface) => {
				if (lobby && !(lobby as ErrorInterface).error) {
					this.updateLobby(null)
					this.$router.push('/multiplayer')
				}
			})
		}
	}

	startLobby()
	{
		if (this.getLobby) {
			this.$socket.client.emit('startLobby', this.getLobby.uid, (data: ErrorInterface | boolean) => {
				if (data && (data as ErrorInterface).error)
					this.$toast.error((data as ErrorInterface).error)
				else if (data === true) {
				}

			})
		}
	}

	sendMessage()
	{
		if (this.getLobby) {
			if (this.message && this.message.length > 0 && this.message.length <= 128)
				this.$socket.client.emit('messageLobby', {
					game_uid: this.getLobby.uid,
					msg: this.message
				}, (data: ErrorInterface | boolean) => {

					if (!data || (data as ErrorInterface).error)
						this.$toast.error((data as ErrorInterface).error)

					if (data)
						this.message = ""
				})
		}
	}

	@Socket('updateChat')
	receiveMsg(msg: string)
	{
		this.addLobbyChatMessage(msg)
	}

}

</script>

<style>

.lobbyRow {
	width: 400px;
}

.imgTetromino {
	@apply object-contain;
	width: 75px;
	height: 30px;
	transition: all 0.3s ease-in-out 0s;
	/*object-fit: cover;*/
}

.imgTetromino:hover
{
	transform: rotate(180deg);
}

</style>