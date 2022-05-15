import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { EventsServices } from './events.services';
import { BoardsService } from 'src/boards/boards.service';
import { RoomType } from 'src/rooms/Room';
import { LobbyDto } from 'src/rooms/dto/lobby.dto';
import { ErrorInterface } from './interfaces/error.interface';
import { WsUser } from "../decorators/ws.user";
import { UsersService } from "../users/users.service";
import { RoomsService } from "../rooms/rooms.service";
import User from 'src/users/user';
import { WsGuard } from 'src/guards/ws.guard';
import { WsAllExceptionsFilter } from "../filters/ws-all-exception.filter";

@WebSocketGateway(Number(process.env.WS_PORT),
{ cors: '*:*' }
)
@UseFilters(WsAllExceptionsFilter)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    constructor(
        private readonly usersService: UsersService,
        private readonly roomsService: RoomsService,
        private readonly eventsService: EventsServices
    ) {}

    private logger: Logger = new Logger(AppGateway.name);

    afterInit(server: Server) {
        this.eventsService.server = server
        this.logger.log(`WebSocket Init: Listen on port ${process.env.WS_PORT}`);
    }

    handleConnection(client: Socket) {

        const user: User = this.usersService.createWsUser(client)
        this.logger.log(`User Connect: ${user.id}`)
        this.eventsService.emitMessage('setUserOnlineUpdate', {
            user: user.toDTO(),
            online: true
        })
    }

    handleDisconnect(client: Socket) {
        try {
            this.logger.log(`User Disconnect: ${client.id}`)

            let user = this.usersService.findOneById(client.id)

            this.eventsService.emitMessage('setUserOnlineUpdate', {
                user: user.toDTO(),
                online: false
            })
            this.roomsService.leaveRoom(user, this.eventsService.server)
            this.usersService.RemoveOneById(client.id)
        } catch (e)
        {
            throw e
        }
    }

}