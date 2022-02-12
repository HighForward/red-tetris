import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import {UpdateUsersOnline, UserInterface} from '@/types/gametype'

enum UserTypeState
{
    GUEST = 'GUEST',
    USERNAME = 'USERNAME',
    NONE = 'NONE'
}

@Module({
    name: 'user',
    stateFactory: true,
    namespaced: true,
})
export default class User extends VuexModule {

    public info: UserInterface = {
        username: 'guest',
        id: '',
        type: UserTypeState.NONE
    }

    public usersOnline: UserInterface[] = []

    get getUsername(): string {
        return this.info.username
    }

    get userType(): string {
        return this.info.type
    }

    @Mutation
    setUserTypeUsername() {
        this.info.type = UserTypeState.USERNAME
    }

    @Mutation
    setUserTypeGuest() {
        this.info.type = UserTypeState.GUEST
    }

    @Mutation
    setUsername(username: string) {
        this.info.username = username
    }

    get getUsersOnline(): UserInterface[] {
      return this.usersOnline
    }

    @Mutation
    setUserOnline(payload: UpdateUsersOnline) {
      let index: number = -1

      if (payload.online === true) {
        this.usersOnline.push(payload.user)
      }
      else {
        index = this.usersOnline.findIndex((u: UserInterface) => u.id === payload.user.id)
        if (index !== -1)
          this.usersOnline.splice(index, 1)
      }
    }

    @Mutation
    setUsersListOnline(users: UserInterface[]) {
      this.usersOnline = users
    }

}
