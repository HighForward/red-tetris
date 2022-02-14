<template>
	<div>

    <div class="flex flex-col p-4 justify-center items-center text-smallgray text-xs" v-if="this.currPlayer">
      <span>Partie de:<span class="m-1 justify-center text-red">{{ " " + this.currPlayer.username }}</span></span>
      <span>Score:<span class="m-1 justify-center text-red">{{ " " + this.score }}</span></span>
    </div>

		<div class="flex flex-col bg-gray rounded-sm" style="box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);">
			<div class="flex flex-row" v-for="(row, i) in this.board" :key="i">
				<div class="h-4 w-4" v-for="(item, x) in row" :key="x">
					<div class="w-full h-full" :class="setColorCall(item)" style="box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.5);"></div>
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
import {setColor} from '@/utils/game-utils'

@Component({})
export default class GameSpectre extends Vue {

	@Prop({required: true}) readonly player!: string

	board: number[][] = []
	currPlayer: UserInterface | null = null
  score: number = 0


	setColorCall(val: number)
	{
		return setColor(val)
	}

	@Socket('getLobbyBoards')
	getLobbyBoards(data: BoardInterface)
	{
		if (data && data.player.id === this.player)
		{
			this.currPlayer = data.player
			this.board = data.board
      this.score = data.score
		}
	}


}

</script>

<style>

</style>
