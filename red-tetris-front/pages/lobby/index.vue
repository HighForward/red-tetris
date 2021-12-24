<template>
	<div class="flex justify-center pt-12 h-full font-semibold">
		<Lobby v-if="this.$store.getters['modules/lobby/getLobby']"></Lobby>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator'
import Lobby from '@/components/Lobby.vue'

@Component({components: {
		Lobby
	}})
export default class Header extends Vue {

}

</script>


<style>

</style>