import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { SubscribeMessage } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { EventsServices } from "src/events/events.services";
import { UserInterface } from "src/events/interfaces/user.interface";
import {GameState, Lobby } from "./classes/lobby";

@Injectable()
export class GamesServices {

    private lobbies: Lobby[] = []
    constructor(private eventsServices: EventsServices,
                private schedulerRegistry: SchedulerRegistry) {}

    getLobbies()
    {
        return this.lobbies.map((lobby) => lobby.toDTO())
    }

    createNewLobby(owner: UserInterface, lobbyName: string, lobbyType: string) : Lobby {

        const newLobby = new Lobby(owner, lobbyName, lobbyType)
        this.lobbies.push(newLobby)
        return newLobby
    }

    getLobby(lobbyName: string)
    {
        return this.lobbies.find((lobby) => { lobby.lobbyName = lobbyName })
    }

    getLobbyByUID(game_uid: string)
    {
        return this.lobbies.find((lobby) => { lobby.game_uid = game_uid })
    }

    startGame(game_uid: string) {

        const lobby = this.lobbies.find((lobby) => { if (lobby.game_uid === game_uid) return true })

        if (lobby)
        {
            const user = this.eventsServices.findOneById(lobby.owner.id)

            if (lobby.owner.id === user.id)
            {
                lobby.state = GameState.Started
                const interval = setInterval(() => {
                    lobby.gameLoop()
                }, 1000)

                this.schedulerRegistry.addInterval(lobby.game_uid, interval)

                return (lobby.toDTO())
            }
        }
    }

    stopGame(game_uid: string) {

        const lobby = this.lobbies.find((lobby) => { if (lobby.game_uid === game_uid) return true })

        if (lobby)
        {
            const user = this.eventsServices.findOneById(lobby.owner.id)

            if (lobby.owner.id === user.id) {
                this.schedulerRegistry.deleteInterval(lobby.game_uid)
            }
        }
    }

    rotateBlock(game_uid: string)
    {
        const lobby = this.lobbies.find((lobby) => { if (lobby.game_uid === game_uid) return true })

        if (lobby)
        {
            const user = this.eventsServices.findOneById(lobby.owner.id)

            if (lobby.owner.id === user.id) {
                lobby.rotateBlock()
            }
        }
    }

    translateBlock(game_uid: string, value: number)
    {
        const lobby = this.lobbies.find((lobby) => { if (lobby.game_uid === game_uid) return true })

        if (lobby)
        {
            const user = this.eventsServices.findOneById(lobby.owner.id)

            if (lobby.owner.id === user.id) {
                lobby.translateBlock(value)
            }
        }
    }
}