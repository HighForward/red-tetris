<template>
	<div class="flex justify-center items-start bg-black h-full font-semibold">
		<div class="flex bg-purple p-2 rounded-sm" style="">

			<div class="flex-col">
				<div class="flex flex-row" v-for="(row, i) in this.board" :key="i">
					<div class="h-8 w-8 border rounded-sm" v-for="(item, x) in row" :key="x">
						<div class="w-full h-full" :class="item === 1 ? 'bg-purple' : 'bg-orange'">{{ item }}</div>
<!--						{{ item }}-->
					</div>
				</div>
			</div>

		</div>

		<div class="flex flex-col">
			<button @click="startCurrentGame" class="ml-4 px-4 py-2 font-semibold bg-orange">
				START
			</button>
			<button @click="stopCurrentGame" class="ml-4 px-4 py-2 font-semibold bg-orange">
				STOP
			</button>
		</div>

	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import connected from '~/middleware/connected'
import { Socket } from 'vue-socket.io-extended'

@Component({
	// middleware: [connected]
})
export default class Game extends Vue {

	currentGame: any = undefined

	board = Array.from(Array(20), _ => Array(10).fill(0))

	asyncData()
	{

	}

	mounted()
	{
		if (this.$socket.connected)
		{
			this.$socket.client.emit('createSoloGame', null, (game) => {
				this.currentGame = game
				this.$toast.success(`${game.lobbyName}`)
			})
		}

		if (this.currentGame)
		{

		}

		document.addEventListener('keydown', (e) => {
			// console.log(e.key)
			if (e.key === 'ArrowUp')
				this.rotateBlock()
			else if (e.key === 'ArrowLeft')
				this.translateBlock(-1)
			else if (e.key === 'ArrowRight')
				this.translateBlock(1)
		})
	}

	startCurrentGame()
	{
		if (this.currentGame)
			this.$socket.client.emit('startGame', this.currentGame.game_uid, (game) => {
				this.currentGame = game
				this.$toast.success('La partie va debuter')
		})
		else
			this.$toast.error('Error: Pas de partie en cours')
	}

	stopCurrentGame()
	{
		if (this.currentGame)
			this.$socket.client.emit('stopGame', this.currentGame.game_uid, () => {
				this.$toast.success('la partie a été arreter')
			})
		else
			this.$toast.error('Error: Pas de partie en cours')
	}

	rotateBlock()
	{
		if (this.currentGame && this.currentGame.state === 'started')
		{
			this.$socket.client.emit('rotateBlock', this.currentGame.game_uid)
		}
	}

	translateBlock(value: number)
	{
		if (this.currentGame && this.currentGame.state === 'started')
		{
			this.$socket.client.emit('translateBlock', { game_uid: this.currentGame.game_uid, value: value })
		}
	}

	@Socket('updateBoard')
	HandleGameEvent(data)
	{
		this.board = data
	}

}

</script>


<style>

</style>