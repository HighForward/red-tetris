<template>
	<div class="bg-gray p-4 rounded-sm" style="box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35); width: 400px;">
		<form @submit.prevent="goToSettings" class="flex flex-col text-xl justify-center">
			<label for="pseudo" class="text-center text-black border-text pb-2">Entre ton pseudo</label>
			<input style="outline: none" id="pseudo" v-model="username" type="text" class="my-2 p-2 rounded-sm bg-gray border rounded-sm text-smallgray border-smallgray">
			<button type="submit" class="GameModeButton">
				<img class="imgTetrisPseudo" src="@/assets/images/Tetromino_Z.svg">
				PLAY
				<img class="imgTetrisPseudo" src="@/assets/images/Tetromino_Z.svg">
			</button>
		</form>
		<button @click="continueAsGuest" class="guestButton flex w-full justify-end items-center mt-4 text-smallgray">
			continuer en tant qu'invité
			<img class="imgTetrisPseudo ml-2" style="width: 18px; height: 18px" src="@/assets/images/Tetromino_O.svg">
		</button>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
const user = namespace('modules/user')

@Component({})
export default class Pseudo extends Vue {

	username: string = ''

	@user.State
	public info!: object

	@user.Getter
	public getUsername!: string

	@user.Getter
	public userType!: string

	@user.Mutation
	public setUserTypeGuest!: () => void

	@user.Mutation
	public setUserTypeUsername!: () => void

	@user.Mutation
	public setUsername!: (username: string) => void

	mounted()
	{
		if (this.userType == 'USERNAME' || this.userType == 'GUEST')
		{
			this.$router.push('/mode')
		}
	}

	created()
	{
	}

	goToSettings(): void {

		if (this.username && this.username.length > 2 && this.username.length < 15)
		{
			this.$socket.client.emit('usernameSelected', this.username, (data: string) => {

				if (data)
				{
					this.setUsername(this.username)
					this.setUserTypeUsername()
					this.$router.push('/mode')
				}

			})
		}
	}

	continueAsGuest() {
		this.$router.push('/mode')
		this.setUserTypeGuest()
	}

}

</script>

<style>

.GameModeButton
{
	@apply flex flex-1 w-full justify-center text-center items-center text-black font-bold text-5xl;
	transition: 0.3s;
	text-shadow: 2px 0 0 #ff0000, -2px 0 0 #ff0000, 0 2px 0 #ff0000, 0 -2px 0 #ff0000, 1px 1px #ff0000, -1px -1px 0 #ff0000, 1px -1px 0 #ff0000, -1px 1px 0 #ff0000;
}

.GameModeButton:hover
{
	transform: scale(0.90);
}

.GameModeButton:hover img {
	transform: rotate(180deg);
}

.imgTetrisPseudo {
	@apply object-contain;
	width: 75px;
	height: 30px;
	transition: 0.3s;
}

.guestButton:hover img
{
	transform: rotate(180deg);
}

</style>