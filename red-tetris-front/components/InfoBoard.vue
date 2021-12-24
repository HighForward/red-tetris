<template>
	<div class="absolute flex flex-col justify-between bg-gray font-semibold transition-all" :style="state ? 'left: 0': 'left: -250px'" style="z-index: 10; top: 200px; width: 250px; box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);">

		<div class="flex flex-row justify-center">
			<h1 class="flex justify-center text-red p-1">{{ this.$store.getters['modules/user/getUsername'] }}</h1>
			<button class="absolute flex justify-center w-full items-center text-xl bg-orange" style="width: 30px; height: 30px; right: -30px" @click="state = !state">
				&times
			</button>
		</div>

		<div v-if="this.$store.getters['modules/lobby/getLobby']" class="flex flex-col m-2">
			<div class="flex flex-col text-smallgray font-normal mx-2 mb-2">
				<p>lobby name: <span class="text-purple ml-1">{{ this.$store.getters['modules/lobby/getLobby'].name }}</span></p>
				<p>lobby state: <span class="text-purple ml-1">{{ this.$store.getters['modules/lobby/getLobby'].state }}</span></p>
				<p v-if="this.$store.getters['modules/board/getBoard']">game state: <span class="text-purple ml-1">{{ this.$store.getters['modules/board/getBoard'].state }}</span></p>
			</div>
			<div class="flex flex-row m-2">
				<nuxt-link to="/lobby" class="flex items-center text-center flex-1 p-1 justify-center rounded-sm border border-smallgray font-semibold text-red mr-2">Retour au Lobby</nuxt-link>
				<nuxt-link v-if="this.$store.getters['modules/board/getBoard'] && this.$store.getters['modules/board/getBoard'].state === 'STARTED'" to="/game" class="flex items-center text-center flex-1 p-1 justify-center rounded-sm border border-smallgray font-semibold text-red ml-2">Retour en game</nuxt-link>
			</div>
		</div>

		<div v-else class="flex flex-col m-2">
			<div class="flex flex-row m-2">
				<nuxt-link to="/multiplayer" class="flex items-center text-center flex-1 p-1 justify-center rounded-sm border border-smallgray font-semibold text-red mr-2">Jouer en multijoueur</nuxt-link>
			</div>
		</div>

	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class InfoBoard extends Vue {

	state: boolean = false
}

</script>

<style>

</style>