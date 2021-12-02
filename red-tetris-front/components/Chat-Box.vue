<template>
	<div class="w-full gamesList mt-4">
		<div class="flex flex-col justify-center w-full bg-gradient-to-r from-orange to-pink p-4 rounded-sm">
			<div class="text-center">ChatBox</div>
			<div class="flex flex-col w-full">
				<div>user: message</div>
				<div>user: message</div>
				<div>user: message</div>
			</div>
			<form  @submit.prevent="sendMessage" class="flex mt-4">
				<input type="text" class="flex flex-1 rounded-sm px-2 py-1" placeholder="Ecrire un message...">
			</form>
		</div>
	</div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class chatBox extends Vue {

	sendMessage()
	{
		console.log('send message')
	}

}

</script>

<style>

</style>