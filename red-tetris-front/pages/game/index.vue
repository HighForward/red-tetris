<template>
	<div v-if="this.getLobby && this.getBoard" class="flex flex-col">

		<div class="flex flex-col w-full p-4 justify-center items-center text-smallgray">
			<span>Partie de:<span class="text-red pl-2 font-bold">{{ " " + getBoard.player.username }}</span></span>
			<span>Score:<span class="text-red pl-2 font-bold">{{ " " + getBoard.score }}</span></span>
		</div>

		<div class="flex flex-row justify-center items-start h-full font-semibold">

			<div class="flex" v-for="player of this.getLobby.players">

				<GameSpectre class="m-4" :player="player.id"></GameSpectre>

			</div>

			<div class="flex flex-col bg-gray rounded-sm" style="box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);">
				<div class="flex flex-row" v-for="(row, i) in this.getBoard.board" :key="i">
					<div class="h-8 w-8" v-for="(item, x) in row" :key="x">
						<div class="w-full h-full" style="box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.5);" :class="setColorCall(item)"></div>
					</div>
				</div>
			</div>

			<div class="flex justify-center ml-8 flex-col bg-gray rounded-sm" style="height: 340px; width: 100px; box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);">

				<div class="flex flex-row justify-center w-full" v-for="(piece, index) in this.getLast5Pieces">
					<div class="flex flex-col m-2">
						<div class="flex flex-row" v-for="(row, x) in piece">
							<div class="h-4 w-4" v-for="(block, y) in row">
								<div class="w-full h-full" :class="setColorCall(block)"></div>
							</div>
						</div>
					</div>
				</div>

			</div>

		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue, namespace} from 'nuxt-property-decorator'
import {Socket} from 'vue-socket.io-extended'
import GameSpectre from '@/components/game/gameSpectre.vue'
import {BoardInterface, LobbyInterface, UserInterface, ErrorInterface } from '@/types/gametype'
import {setColor} from "~/utils/game-utils";

const user = namespace('modules/user')
const LobbyStore = namespace('modules/lobby')
const BoardStore = namespace('modules/board')

export enum GameState
{
	WARM = 'WARM',
	STARTED = 'STARTED',
	FINISHED = 'FINISHED'
}

@Component({
	components: {GameSpectre}
})
export default class Game extends Vue {

	@BoardStore.Getter
	public getLast5Pieces!: []

	@BoardStore.Getter
	public getBoard!: BoardInterface | null

	@LobbyStore.Getter
	public getLobby!: LobbyInterface | null

  keySet: Record<string, boolean> = {
    "ArrowUp": false,
    "ArrowDown": false,
    "ArrowLeft": false,
    "ArrowRight": false,
    " ": false
  }

  setColorCall(val: number)
  {
    return setColor(val)
  }

  keyDownEvents(e: KeyboardEvent)
	{
    if (!this.keySet[e.key])
    {
      this.keySet[e.key] = true
      this.moveAction(e.key)
    }
	}

  keyUpEvents(e: KeyboardEvent)
  {
    this.keySet[e.key] = false
  }

  moveAction(key: string)
  {

    let delay = 100
    if (key === ' ')
      delay = 400
    else if (key === 'ArrowUp')
      delay = 150

    if (this.keySet['ArrowUp'] && key === 'ArrowUp')
      this.rotateBlock()
    else if (this.keySet['ArrowLeft'] && key === 'ArrowLeft')
      this.translateBlock(-1)
    else if (this.keySet['ArrowRight'] && key ==='ArrowRight')
      this.translateBlock(1)
    else if (this.keySet['ArrowDown'] && key === 'ArrowDown')
      this.fastDown()
    else if (this.keySet[' '] && key === ' ')
      this.instantDown()

    setTimeout(() => {
      if (this.keySet[key])
        this.moveAction(key)
    }, delay)
  }

	mounted()
	{
		document.addEventListener('keydown', this.keyDownEvents)
		document.addEventListener('keyup', this.keyUpEvents)
  }

	beforeDestroy()
	{
		document.removeEventListener('keydown', this.keyDownEvents)
		document.removeEventListener('keydown', this.keyUpEvents)
	}

	rotateBlock()
	{
		if (this.getLobby && this.getBoard && this.getBoard.state === GameState.STARTED)
		{
			this.$socket.client.emit('rotateBlock', this.getLobby.uid)
		}
	}

	translateBlock(value: number)
	{
		if (this.getLobby && this.getBoard && this.getBoard.state === GameState.STARTED)
		{
			this.$socket.client.emit('translateBlock', { game_uid: this.getLobby.uid, value: value })
		}
	}

	fastDown()
	{
		if (this.getLobby && this.getBoard && this.getBoard.state === GameState.STARTED)
		{
			this.$socket.client.emit('fastDown', this.getLobby.uid)
		}
	}

  instantDown()
	{
		if (this.getLobby && this.getBoard && this.getBoard.state === GameState.STARTED)
		{
			this.$socket.client.emit('instantDown', this.getLobby.uid)
		}
	}
}

</script>


<style>

</style>
