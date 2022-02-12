import { Injectable } from "@nestjs/common";
import { UserInterface, UserType } from "./interfaces/user.interface";
import { Socket } from 'socket.io';


@Injectable()
export class EventsServices {

    private users: UserInterface[] = []

    findOneById(id: string) : UserInterface | undefined
    {
        let user_index: number = -1
        if ((user_index = this.users.findIndex((user) => user.id === id)) !== -1)
        {
            return this.users[user_index]
        }
        return undefined
    }

    findOneIndexById(id: string) : number {
        return this.users.findIndex((user) =>  { return user.id === id })
    }

    RemoveOneById(id: string) : void
    {
        let user_index: number = -1
        if ((user_index = this.findOneIndexById(id)) !== -1)
        {
            this.users.splice(user_index, 1)
        }
    }

    pushUserId(id: string, client: Socket) : void
    {
        const user: UserInterface = {
            id: id,
            username: `guest#${id.substring(0, 4)}`,
            socket: client,
            type: UserType.NONE
        }
        this.users.push(user)
    }

    setUsername(id: string, username: string) {
        let user = this.findOneById(id)
        if (user) {
            user.username = username
            user.type = UserType.USERNAME
        }
    }

    getUsers()
    {
        return this.users
    }
}