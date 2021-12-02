<template>
	<div class="flex">
		<button @click="this.goBack" class="text-xl bg-black pl-4" style="color: white"><</button>
		<div  class=" flex w-full justify-center items-center bg-black" style="height: 64px" >
			<nuxt-link to="/" class="text-2xl font-semibold text-orange">
					RED TETRIS
			</nuxt-link>
		</div>
	</div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Header extends Vue {
	title: string = "RED TETRIS"

	goBack()
	{
		window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
	}
}

</script>

<style>

</style>