<template>
	<div class="w-full">
		<div class="flex flex-row justify-center w-full">
			<div class="flex flex-1 flex-col gamesList flex flex-row bg-gradient-to-r from-pink to-orange p-4 rounded-sm">
				<div class="text-center">Liste des parties</div>
				<div class="bg-black my-4" style="height: 1px"></div>
				<div class="flex flex-col">
					<p v-for="lobby in this.lobbies">{{ lobby.lobbyName }}</p>
				</div>
			</div>

			<div class="flex flex-col">
				<form @submit.prevent="createGame" class="flex flex-1 flex-col gamesList flex flex-row bg-gradient-to-r from-orange to-pink p-4 rounded-sm">
					<div class="text-center">Créer une partie</div>
					<div class="bg-black my-4" style="height: 1px"></div>
					<input v-model="gameName" id="usernameInput" type="text" class="rounded-sm px-2 py-1" placeholder="Nom de la partie">
					<button class="mt-4">Créer le lobby</button>
				</form>
				<chatBox/>
			</div>
		</div>
	</div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import chatBox from '../components/Chat-Box.vue'
import { Socket } from 'vue-socket.io-extended'

@Component({components: {
		chatBox
	}
})
export default class MultiplayerLobby extends Vue {

	gameName: string = ""
	lobbies: any = null

	mounted()
	{
		this.$socket.client.emit('getLobbies', null, (data) => {
			console.log(data)
			this.lobbies = data
		})
	}

	async createGame()
	{
		this.$socket.client.emit('createGame', this.gameName, (data) => {

			if (!data.error)
			{
				this.$toast.success(`Le lobby ${data.lobbyName} à été créer`)
			}

		})
	}

	@Socket('newLobby')
	addLobby(data)
	{
		this.lobbies.push(data)
	}

}

</script>

<style>

.gamesList {
	@apply mx-8;
	width: 400px;
	max-width: 400px;
	min-width: 400px;
}

</style>