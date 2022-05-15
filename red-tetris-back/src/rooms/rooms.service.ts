import { Injectable } from '@nestjs/common';
import { Server } from "socket.io";
import { ErrorInterface } from "../events/interfaces/error.interface";
import { SchedulerRegistry } from "@nestjs/schedule";
import Room, { RoomDTO, RoomState, RoomType } from "./Room";
import User from "../users/user";
import { WsException } from "@nestjs/websockets";
import { EventsServices } from "../events/events.services";

@Injectable()
export class RoomsService {

    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private eventsService: EventsServices
        ) {}

    private rooms: Room[] = []

    /** LOBBY HANDLER **/

    getRoomByUID(uid: string)
    {
        return this.rooms.find((room) => { return room.uid === uid })
    }

    userHasRoom(player: User) : boolean
    {
        return !!player.currentRoom
    }

    createRoom(owner: User, lobbyName: string, lobbyType: RoomType, server: Server) : RoomDTO
    {

        if (this.userHasRoom(owner))
            this.leaveRoom(owner, server)

        const room = new Room(owner, lobbyName, lobbyType)
        this.rooms.push(room)
        owner.currentRoom = room
        this.eventsService.emitMessage('newLobby', room.toDTO())
        return room.toDTO()
    }

    joinRoom(user: User, uid: string, server: Server) : RoomDTO | ErrorInterface
    {
        let room = this.getRoomByUID(uid)

        if (room) {

            if (room.players.length === 8)
                return { error: 'Lobby is full' }

            if (!user.currentRoom) {

                if (this.userHasRoom(user))
                    this.leaveRoom(user, server)

                room.joinLobby(user)
            }

            room.emitUpdateLobby()
            this.eventsService.emitMessage('updateLobbyList', room.toDTO())

            return room.toDTO()
        }
        return { error: 'Lobby do not exists' }
    }

    leaveRoom(user: User, server: Server) : RoomDTO | object
    {
        if (user.currentRoom)
        {
            let tmp_room = user.currentRoom
            //return false if room become empty
            if (!user.currentRoom.leaveLobby(user, this.schedulerRegistry, server))
            {
                const index = this.rooms.findIndex((room_tmp) => {return room_tmp.uid === tmp_room.uid})
                if (index !== -1) {
                    this.eventsService.emitMessage('removeLobby', tmp_room.toDTO())
                    this.rooms.splice(index, 1)
                    return tmp_room.toDTO()
                }
            }
            tmp_room.emitUpdateLobby()
            this.eventsService.emitMessage('updateLobbyList', tmp_room.toDTO())

            user.currentRoom = null
            return tmp_room.toDTO()
        }
        // throw new WsException('Error while leaving room')
        return {error: 'error leaving room'}
    }

    isUserRoomOwner(user: User) : boolean
    {
        return user.currentRoom && user.currentRoom.owner.id === user.id
    }

    getRooms() : RoomDTO[]
    {
        return this.rooms.map((lobby) => lobby.toDTO())
    }

    startRoom(user: User, uid: string, server: Server) : boolean
    {
        if (this.isUserRoomOwner(user) && user.currentRoom.state === RoomState.WARMING)
        {
            user.currentRoom.startLobby(this.schedulerRegistry, server)

            this.eventsService.emitMessage('updateLobbyList', user.currentRoom.toDTO())
            return true
        }
        return false
    }

    sendMessageToRoom(user: User, msg: string)
    {
        if (user.currentRoom)
        {
            user.currentRoom.emitMsgToChat(msg, user)
        }

    }

}
