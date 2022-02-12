<template>
    <div  class="playerList px-10 pt-10" style="font-family: 'Play', sans-serif; overflow: hidden" >
      <div class="ListWrap" :style="!toggle ? 'bottom: -348px' : 'bottom: 0'" style="box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.35);">
        <div  class="" style="height: 384px; width: 256px;" >
          <div @click="toggle = !toggle" class="cursor-pointer">
            <div class="text-center text-purple py-1 text-lg font-semibold">LIST OF PLAYERS ({{this.$store.getters['modules/user/getUsersOnline'].length}})</div>
            <img :style="toggle ? 'transform: rotate(180deg)' : ''" class="arrowUpDown" src="@/assets/images/up-arrow.png" alt="">
          </div>
          <div class="flex flex-col mt-2 mx-4 text-smallgray" style="max-height: 100%">
            <span class="py-1 hover:underline cursor-pointer" v-for="user of this.$store.getters['modules/user/getUsersOnline']">{{ user.username }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, namespace} from 'nuxt-property-decorator'

const UserStore = namespace('modules/user')

@Component({})
export default class PlayerList extends Vue {

  toggle: boolean = true
}

</script>

<style>


.arrowUpDown
{
  @apply absolute top-2.5 right-4 h-4 w-4;
  transition: all 0.5s;
}

.ListWrap
{
  @apply relative bg-gray;
  transition: all 0.5s;
}

.playerList
{
  @apply absolute;
  bottom: 0;
  right: 0;
}

</style>
