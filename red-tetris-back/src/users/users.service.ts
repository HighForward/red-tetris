import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";
import User, { UserType } from "./user";
import { log } from "util";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class UsersService {

    users: User[] = []

    findOneById(id: string) : User | undefined
    {
        return this.users.find((user) => { return user.id === id })
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
        console.log(this.getUsers().length)
    }

    createWsUser(client: Socket) : User
    {
        const user: User = new User(client)
        this.users.push(user)
        return user
    }

    setUsername(id: string, username: string) : User {
        let user = this.findOneById(id)
        if (user) {
            user.username = username
            user.type = UserType.USERNAME
        }
        return user
    }

    getUsers() : User[]
    {
        return this.users
    }

}
