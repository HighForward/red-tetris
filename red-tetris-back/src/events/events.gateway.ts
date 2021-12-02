import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { EventsServices } from './events.services';
import { GamesServices } from 'src/games/games.services';
import { LobbyType } from 'src/games/classes/lobby';
import { LobbyDto } from 'src/games/dto/lobby.dto';

@WebSocketGateway(81, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(private eventsServices: EventsServices,
                private gamesServices: GamesServices) {}
    @WebSocketServer() server: Server

    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway listening');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        this.eventsServices.pushUserId(client.id, client)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.eventsServices.RemoveOneById(client.id)
    }

    @SubscribeMessage('usernameSelected')
    validateUsername(client: Socket, payload: string) {
        this.eventsServices.setUsername(client.id, payload)
    }

    @SubscribeMessage('createGame')
    createGame(client: Socket, payload: string) {

        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'not connected' })

        const lobby = this.gamesServices.createNewLobby(user, payload, LobbyType.Multi)
        this.server.emit('newLobby', lobby)
        return (lobby.toDTO())

    }

    @SubscribeMessage('createSoloGame')
    createSoloGame(client: Socket, payload: void)
    {
        const user = this.eventsServices.findOneById(client.id)
        if (!user)
            return ({ error: 'not connected' })

        const lobby = this.gamesServices.createNewLobby(user, `Game de ${client.id}`, LobbyType.Solo)
        this.server.emit('newLobby', lobby.toDTO())
        return (lobby.toDTO())
    }

    @SubscribeMessage('getLobbies')
    getLobbys(client: Socket, payload: void) {

        const lobbies = this.gamesServices.getLobbies()
        return lobbies
    }

    @SubscribeMessage('startGame')
    startGame(client: Socket, game_uid: string)
    {
        return this.gamesServices.startGame(game_uid)
    }

    @SubscribeMessage('stopGame')
    stopGame(client: Socket, game_uid: string)
    {
        return this.gamesServices.stopGame(game_uid)
    }

    @SubscribeMessage('rotateBlock')
    rotateBlock(client: Socket, game_uid: string)
    {
        this.gamesServices.rotateBlock(game_uid)
    }

    @SubscribeMessage('translateBlock')
    translateBlock(client: Socket, payload: { game_uid: string, value: number })
    {
        this.gamesServices.translateBlock(payload.game_uid, payload.value)
    }

}