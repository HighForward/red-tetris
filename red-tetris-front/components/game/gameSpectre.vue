<template>
	<div>
		<h1 class="flex text-xs m-1 justify-center text-red" v-if="this.currPlayer" >{{ this .currPlayer.username}}</h1>
		<div class="flex flex-col bg-gray rounded-sm" style="box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);">
			<div class="flex flex-row" v-for="(row, i) in this.board" :key="i">
				<div class="h-4 w-4" v-for="(item, x) in row" :key="x">
					<div class="w-full h-full" :class="setColor(item)" style="box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.5);"></div>
				</div>
			</div>
		</div>
	</div>
</template>


<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import {Socket} from 'vue-socket.io-extended'
import { BoardInterface} from '@/types/gametype'
import {UserInterface, LobbyInterface} from '@/types/gametype'

@Component({})
export default class GameSpectre extends Vue {

	@Prop({required: true}) readonly player!: string

	board: number[][] = []
	currPlayer: UserInterface | null = null

	mounted()
	{
		// this.board = new Array(20).fill(new Array(10).fill(0))
	}


	setColor(val: number)
	{
		if (val === 1)
			return 'bg-purple'
		if (val === 2)
			return 'bg-yellow'
		if (val === 3)
			return 'bg-green'
		if (val === 4)
			return 'bg-blue'
		if (val === 5)
			return 'bg-orange'
		if (val === 6)
			return 'bg-bluesky'
		if (val === 7)
			return 'bg-red'
	}

	@Socket('getLobbyBoards')
	getLobbyBoards(data: BoardInterface)
	{
		if (data && data.player.id === this.player)
		{
			this.currPlayer = data.player
			this.board = data.board
		}
	}


}

</script>

<style>

</style>