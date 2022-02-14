import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { EventsServices } from './events.services';
import { GamesServices } from 'src/games/games.services';
import { LobbyType } from 'src/games/classes/LobbyHandler';
import { LobbyDto } from 'src/games/dto/lobby.dto';
import { ErrorInterface } from './interfaces/error.interface';
import {UserDTO} from "./interfaces/user.interface";

@WebSocketGateway(Number(process.env.WS_PORT),
{ cors: '*:*' }
)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(private eventsServices: EventsServices,
                private gamesServices: GamesServices) {}
    @WebSocketServer() server: Server

    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server) {
        console.log(`WebSocket Gateway listening on port: ${process.env.WS_PORT}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.eventsServices.pushUserId(client.id, client)
        const {socket, ...payload} = this.eventsServices.findOneById(client.id)
        this.server.emit('setUserOnlineUpdate', {
            user: payload,
            online: true
        })
    }

    handleDisconnect(client: Socket) {

        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        this.gamesServices.removePlayerFromEverything(user, this.server)
        const {socket, ...payload} = user
        console.log(payload)
        this.server.emit('setUserOnlineUpdate', {
            user: payload,
            online: false
        })
        this.eventsServices.RemoveOneById(client.id)

    }

    @SubscribeMessage('getGuestUsername')
    getGuestUsername(client: Socket)
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        return user.username
    }

    @SubscribeMessage('usernameSelected')
    validateUsername(client: Socket, username: string) {
        let user = this.eventsServices.setUsername(client.id, username)
        const {socket, ...payload} = user
        this.server.emit('updateUsernameOnlineList', payload)
        return true
    }

    @SubscribeMessage('getUsersOnline')
    getUsersOnline(client: Socket) : UserDTO[]
    {
        const users = this.eventsServices.getUsers()
        return users.map((user) => {
            return {
                id: user.id,
                username: user.username,
                type: user.type
            }
        })
    }

    /** LOBBY EVENTS **/

    @SubscribeMessage('createLobby')
    async createLobby(client: Socket, payload: string): Promise<ErrorInterface | LobbyDto> {

        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online'})

        const lobby = this.gamesServices.createLobby(user, payload, LobbyType.Multi, this.server)
        return lobby
    }

    @SubscribeMessage('joinLobby')
    joinLobby(client: Socket, uid: string) : LobbyDto | ErrorInterface
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        const lobby = this.gamesServices.joinLobby(user, uid, this.server)
        return lobby
    }

    @SubscribeMessage('getLobby')
    getLobby(client: Socket, uid: string) : LobbyDto | object
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        const lobby = this.gamesServices.getLobbyOfUser(user, uid)
        if (!lobby)
            return ({ error: 'Lobby can\'t be found' })
        return lobby.toDTO()
    }

    @SubscribeMessage('getLobbies')
    getLobbys(client: Socket, payload: void) : LobbyDto[] {

        const lobbies = this.gamesServices.getLobbies()
        return lobbies
    }

    @SubscribeMessage('leaveLobby')
    leaveLobby(client: Socket, uid: string)
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        return this.gamesServices.leaveLobby(user, this.server)
    }

    @SubscribeMessage('startLobby')
    startLobby(client: Socket, uid: string)
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        if (!this.gamesServices.startLobby(user, uid, this.server))
            return ({ error: 'Tu n\'as pas les droits pour lancer cette partie' })
        else
            true

    }

    @SubscribeMessage('messageLobby')
    receiveMsgLobby(client: Socket, payload: { game_uid: string, msg: string }) : ErrorInterface | boolean
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        this.gamesServices.sendMessageToLobby(user, payload.game_uid, payload.msg)
        return true
    }

    /** **/
    /** GAME EVENT **/

    @SubscribeMessage('rotateBlock')
    rotateBlock(client: Socket, game_uid: string)
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        this.gamesServices.rotateBlock(user, game_uid)
    }

    @SubscribeMessage('translateBlock')
    translateBlock(client: Socket, payload: { game_uid: string, value: number })
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        this.gamesServices.translateBlock(user, payload.game_uid, payload.value)
    }

    @SubscribeMessage('fastDown')
    fastDown(client: Socket, game_uid: string)
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        this.gamesServices.fastDown(user, game_uid, this.server)
    }

    @SubscribeMessage('instantDown')
    instantDown(client: Socket, game_uid: string)
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'You\'re not online.' })

        this.gamesServices.instantDown(user, game_uid, this.server)
    }

    /** **/

}