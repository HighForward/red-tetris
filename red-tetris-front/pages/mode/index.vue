<template>
	<div class="flex flex-1 flex-col w-full font-semibold" style="">
		<div class="w-full mt-12 transition-all h-full" :class="pageLoaded ? 'LobbyDivShow' : 'LobbyDivHide'">
			<div class="text-purple text-3xl text-center">Joue à Tetris seul, ou affontre d'autres adversaires</div>
			<div class="flex justify-center py-8" style="max-width: 100vw; overflow-x: hidden">
				<nuxt-link to="/game" class="text-green buttonLobby" style="box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);" :class="!pageLoaded ? 'ButtonLobbyTransformL' : ''">Solo</nuxt-link>
				<nuxt-link to="/multiplayer" class="text-red buttonLobby" style="box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);" :class="!pageLoaded ? 'ButtonLobbyTransformR' : ''">Battle Royale</nuxt-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'


@Component({components: {}})
export default class Mode extends Vue {

	pageLoaded: boolean = false

	async mounted()
	{
		await setTimeout(() => {
			this.pageLoaded = true
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

	@apply flex justify-center text-center items-center text-3xl font-semibold p-4 rounded-sm mx-12;
	transition: all 0.3s;
	width: 200px;

}

</style>