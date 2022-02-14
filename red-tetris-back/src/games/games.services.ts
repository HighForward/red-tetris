import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { SubscribeMessage, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { EventsServices } from "src/events/events.services";
import { ErrorInterface } from "src/events/interfaces/error.interface";
import { UserInterface } from "src/events/interfaces/user.interface";
import LobbyHandler, {LobbyState, LobbyType } from "./classes/LobbyHandler";
import { LobbyDTO } from "./classes/LobbyHandler";

@Injectable()
export class GamesServices {

    constructor(private eventsServices: EventsServices,
                private schedulerRegistry: SchedulerRegistry) {}

    private LobbyHandler: LobbyHandler[] = []

    /** LOBBY HANDLER **/

    getLobbyByUID(uid: string)
    {
        return this.LobbyHandler.find((lobby) => { return lobby.uid === uid })
    }

    removePlayerFromEverything(player: UserInterface, server: Server)
    {
        this.leaveLobby(player, server)
    }

    isUserAlreadyInLobby(player: UserInterface)
    {
        const lobbyTarget = this.LobbyHandler.filter((lobby) => {
            return lobby.isPlayerOfLobby(player)
        })

        return (lobbyTarget.length > 0)
    }

    createLobby(owner: UserInterface, lobbyName: string, lobbyType: LobbyType, server: Server) : LobbyDTO
    {

        if (this.isUserAlreadyInLobby(owner))
            this.removePlayerFromEverything(owner, server)

        const lobby = new LobbyHandler(owner, lobbyName, lobbyType)
        this.LobbyHandler.push(lobby)
        server.emit('newLobby', lobby.toDTO())
        return lobby.toDTO()
    }

    joinLobby(user: UserInterface, uid: string, server: Server) : LobbyDTO | ErrorInterface
    {
        let lobby = this.getLobbyByUID(uid)

        if (lobby) {

            if (lobby.players.length === 8)
                return { error: 'Lobby is full' }

            if (!lobby.isPlayerOfLobby(user)) {

                if (this.isUserAlreadyInLobby(user))
                    this.removePlayerFromEverything(user, server)

                lobby.joinLobby(user)
            }


            lobby.emitUpdateLobby()
            server.emit('updateLobbyList', lobby.toDTO())

            return lobby.toDTO()
        }
        return { error: 'Lobby do not exists' }
    }

    leaveLobby(user: UserInterface, server: Server) : LobbyDTO | object
    {
        let lobby = this.LobbyHandler.find((lobby) => {
            return (lobby.players.filter((usertmp) => usertmp.id === user.id).length)
        })

        if (lobby)
        {
            //return false if lobby become empty
            if (!lobby.leaveLobby(user, this.schedulerRegistry, server))
            {
                const index = this.LobbyHandler.findIndex((lobbytmp) => {return lobbytmp.uid === lobby.uid})
                if (index !== -1) {
                    server.emit('removeLobby', lobby.toDTO())
                    this.LobbyHandler.splice(index, 1)
                    return lobby.toDTO()
                }
            }

            lobby.emitUpdateLobby()
            server.emit('updateLobbyList', lobby.toDTO())

            return lobby.toDTO()
        }
        return { error: 'Error while leaving lobby' }
    }

    getLobbyOfUser(user: UserInterface, uid: string) : LobbyHandler | undefined
    {
        const lobby = this.getLobbyByUID(uid)
        if (lobby)
        {
            const user = lobby.players.find((user) => { return user.id === user.id })
            if (user)
                return lobby
        }
        return undefined
    }

    isUserOwnerOfLobby(user: UserInterface) : LobbyHandler | undefined
    {
        return this.LobbyHandler.find((lobby) => {
            return (lobby.owner.id === user.id)
        })
    }

    getLobbies() : LobbyDTO[]
    {
        return this.LobbyHandler.map((lobby) => lobby.toDTO())
    }

    startLobby(user: UserInterface, uid: string, server: Server) : boolean
    {
        let lobby = this.isUserOwnerOfLobby(user)
        if (lobby && lobby.uid === uid && lobby.state === LobbyState.WARMING)
        {
            lobby.startLobby(this.schedulerRegistry, server)

            server.emit('updateLobbyList', lobby.toDTO())

            return true
        }
        return false
    }

    sendMessageToLobby(user: UserInterface, game_uid: string, msg: string)
    {
        let lobby = this.getLobbyOfUser(user, game_uid)

        if (lobby)
        {
            lobby.pushNewMessage(user, msg)
        }

    }

    rotateBlock(user: UserInterface, game_uid: string)
    {
        let lobby = this.getLobbyOfUser(user, game_uid)

        if (lobby)
        {
            lobby.rotateBlock(user)
        }
    }

    translateBlock(user: UserInterface, game_uid: string, value: number)
    {
        let lobby = this.getLobbyOfUser(user, game_uid)

        if (lobby)
        {
            lobby.translateBlock(user, value)
        }
    }

    fastDown(user: UserInterface, game_uid: string, server: Server)
    {
        let lobby = this.getLobbyOfUser(user, game_uid)
        if (lobby)
        {
                lobby.fastDown(user, this.schedulerRegistry, server)
        }
    }

    instantDown(user: UserInterface, game_uid: string, server: Server)
    {
        let lobby = this.getLobbyOfUser(user, game_uid)
        if (lobby)
        {
            lobby.instantDown(user, this.schedulerRegistry, server)
        }
    }

}