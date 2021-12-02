<template>
	<div class="w-full" style="">
		<Header/>
		<div style="min-height: calc(100vh - 64px); width: 100%; font-family: 'Play', sans-serif" class="bg-black">
			<Nuxt />
		</div>
	</div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'


@Component({})
export default class App extends Vue {

	mounted()
	{
		// this.$socket.client.disconnect()
	}

}
</script>
