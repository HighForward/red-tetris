import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { UserInterface } from '@/types/gametype'

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
}