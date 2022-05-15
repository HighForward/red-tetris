import { Socket } from "socket.io";
import Room from "../rooms/Room";
import { Board } from "../boards/board";

export interface UserDTO
{
    id: string;
    username: string;
    type: UserType
}

export enum UserType
{
    GUEST = 'GUEST',
    USERNAME = 'USERNAME',
    NONE = 'NONE'
}

export default class User {

    id: string;
    username: string;
    type: UserType
    socket: Socket
    currentRoom: Room
    currentBoard: Board

    constructor(client: Socket) {
        this.id = client.id
        this.username = `guest#${client.id.substring(0, 4)}`
        this.socket = client
        this.type = UserType.NONE
        this.currentRoom = null
        this.currentBoard = null
    }

    toDTO() : UserDTO
    {
        return {
            id: this.id,
            username: this.username,
            type: this.type
        }
    }

}