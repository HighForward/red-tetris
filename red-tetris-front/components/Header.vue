<template>
	<div class="flex" style="font-family: 'Play', sans-serif;">
		<div  class=" flex w-full justify-center items-center bg-gray" style="height: 64px; box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);" >
			<nuxt-link to="/" class="text-2xl font-semibold text-orange">
					RED TETRIS
			</nuxt-link>
		</div>

	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class Header extends Vue {

}

</script>

<style>

</style>
