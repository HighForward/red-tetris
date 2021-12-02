<template>
  <div class="flex justify-center items-start pt-24 bg-black h-full font-semibold">
	  <div class="bg-gradient-to-r from-orange to-pink p-4 rounded-sm" style="width: 400px;">
		  <form @submit.prevent="goToSettings" class="flex flex-col text-xl justify-center">
			  <label for="pseudo" class="text-center pb-2">Entre ton pseudo</label>
			  <input id="pseudo" v-model="username" type="text" class="my-2 p-2">
		  <button type="submit" class="GameModeButton">PLAY</button>
		  </form>
	  </div>
  </div>
</template>

<script lang="ts">
	import { Vue, Component, Prop } from 'vue-property-decorator'

	@Component({})
	export default class Header extends Vue {

		transition: string = ""
		username: string = ""

		asyncData()
		{
			// if (this.$socket.connected)
			// 	this.$socket.client.disconnect()
		}

		mounted()
		{
			// console.log(this.$router.currentRoute.hash)
		}

		goToSettings(): void {

			if (this.username && this.username.length > 2 && this.username.length < 15)
			{
			// 	this.$socket.client.connect()
				this.$socket.client.emit('usernameSelected', this.username)
				this.$router.push('/gametype')
			}
		}
	}

</script>


<style>

.GameModeButton
{
	@apply flex flex-1 w-full justify-center text-center text-black font-bold text-5xl;
	transition: 0.3s;
	text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
}

.GameModeButton:hover
{
	transform: scale(0.90);
}

</style>