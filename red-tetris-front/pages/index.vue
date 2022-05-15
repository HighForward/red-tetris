<template>
	<div class="flex justify-center pt-12 h-full font-semibold">
		<Pseudo></Pseudo>
    <button @click="testws">
      test websocket
    </button>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator'
import Pseudo from '/components/Pseudo.vue'

@Component({
	components: {
		Pseudo
	}
})
export default class Header extends Vue {


  testws()
  {
    this.$socket.client.emit('testUser', 'test', (payload: string) => {
      console.log(payload)
    })
  }

}

</script>


<style>

</style>
