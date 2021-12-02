<template>
	<div class="flex flex-col bg-black w-full font-semibold" style="">
		<div class="w-full pt-12 transition-all" :class="pageLoaded ? 'LobbyDivShow' : 'LobbyDivHide'">
			<div class="text-purple text-3xl text-center">Joue à Tetris seul, ou affontre d'autres adversaires</div>
			<div class="flex justify-center pt-8" style="max-width: 100vw; overflow-x: hidden">
				<nuxt-link to="/game" class="ButtonLobbyLeft buttonLobby bg-gradient-to-r from-pink to-orange" :class="!pageLoadedAfter ? 'ButtonLobbyTransformL' : ''">Solo</nuxt-link>
				<nuxt-link to="/multiplayer" class="ButtonLobbyRight buttonLobby bg-gradient-to-r from-orange to-pink" :class="!pageLoadedAfter ? 'ButtonLobbyTransformR' : ''">Battle Royale</nuxt-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import MultiplayerLobby from '../components/Multiplayer-Lobby.vue'


@Component({components: {
		MultiplayerLobby
	}})
export default class Settings extends Vue {
	pageLoaded: boolean = false
	pageLoadedAfter: boolean = false

	async mounted()
	{
		await setTimeout(() => {
			this.pageLoaded = true
		}, 200)

		await setTimeout(() => {
			this.pageLoadedAfter = true
		}, 200)
	}
}
</script>

<style>

.LobbyDivBasic
{
	/*height: 800px;*/

}

.LobbyDivHide {
	visibility: hidden;
	opacity: 0;
}

.LobbyDivShow {
	visibility: visible;
	opacity: 1;
}

.ButtonLobbyTransformL
{
	transform: translate(-100vw);
}

.ButtonLobbyTransformR
{
	transform: translate(100vw);
}

.buttonLobby {

	@apply flex justify-center text-center items-center text-black text-3xl font-semibold p-4 rounded-sm mx-12;
	transition: all 0.3s;
	width: 200px;

}

</style>