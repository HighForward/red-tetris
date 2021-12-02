import { Injectable } from "@nestjs/common";
import { UserInterface } from "./interfaces/user.interface";
import { Socket } from 'socket.io';


@Injectable()
export class EventsServices {

    private users: UserInterface[] = []

    findOneById(id: string) : UserInterface | undefined
    {
        let user_index: number = -1
        if ((user_index = this.users.findIndex((user) => user.id === id)) !== -1)
        {
            return this.users.at(user_index)
        }
        return undefined
    }

    findOneIndexById(id: string) : number {
        return this.users.findIndex((user) => user.id === id)
    }

    RemoveOneById(id: string) : void
    {
        let user_index: number = -1
        if ((user_index = this.findOneIndexById(id)) !== -1)
        {
            this.users.splice(user_index)
        }
    }

    pushUserId(id: string, client: Socket) : void
    {
        const user: UserInterface = {
            id: id,
            username: "",
            socket: client,
        }
        this.users.push(user)
    }

    setUsername(id: string, payload: string) {
        this.findOneById(id).username = payload
    }
}