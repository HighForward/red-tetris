<template>
	<div class="flex justify-center pt-12 h-full font-semibold">
		<Pseudo></Pseudo>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator'
import Pseudo from '/components/Pseudo.vue'
import {connected} from '../middleware/connected'

@Component({
	components: {
		Pseudo
	}
})
export default class Header extends Vue {

}

</script>


<style>

</style>