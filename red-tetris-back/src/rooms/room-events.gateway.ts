import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ErrorInterface } from "../events/interfaces/error.interface";
import { LobbyDto } from "./dto/lobby.dto";
import { RoomDTO, RoomType } from "./Room";
import { UsersService } from "../users/users.service";
import { BoardsService } from "../boards/boards.service";
import { RoomsService } from "./rooms.service";
import { Logger, UseGuards } from "@nestjs/common";
import { WsGuard } from "../guards/ws.guard";
import { WsUser } from "../decorators/ws.user";
import { WsData } from "../decorators/ws-data.decorator";
import User from "../users/user";

@UseGuards(WsGuard)
@WebSocketGateway(Number(process.env.WS_PORT),
    { cors: '*:*' }
)
export class RoomEventsGateway {

    constructor(
        private readonly roomsService: RoomsService
    ) {}

    private readonly logger = new Logger(RoomEventsGateway.name)

    @WebSocketServer() server: Server

    @SubscribeMessage('getLobbies')
    getRooms(@WsUser() user: User) : RoomDTO[] {

        this.logger.log('getRooms() get all Rooms')
        return this.roomsService.getRooms()
    }

    @SubscribeMessage('createLobby')
    async createLobby(@WsUser() user: User, @WsData() payload: string): Promise<RoomDTO | ErrorInterface> {

        this.logger.log(`CreateLobby() user: ${user.id}`)
        return this.roomsService.createRoom(user, payload, RoomType.Multi, this.server)
    }

    @SubscribeMessage('joinLobby')
    joinLobby(@WsUser() user: User, @WsData() uid: string) : RoomDTO | ErrorInterface
    {
        this.logger.log(`joinLobby() user: ${user.id}, room: ${uid}`)
        return this.roomsService.joinRoom(user, uid, this.server)
    }

    @SubscribeMessage('leaveLobby')
    leaveLobby(@WsUser() user: User)
    {
        this.logger.log(`leaveLobby() user: ${user?.id}, room: ${user?.currentRoom?.uid}`)
        return this.roomsService.leaveRoom(user, this.server)
    }

    @SubscribeMessage('startLobby')
    startLobby(@WsUser() user: User, @WsData() uid: string)
    {
        this.logger.log(`startLobby() user: ${user?.id}, room: ${user?.currentRoom?.uid}`)
        if (!this.roomsService.startRoom(user, uid, this.server))
        {
            this.logger.log(`startLobby() cannot start: ${user?.id}, room: ${user?.currentRoom?.uid}`)
            throw new WsException(`Tu n'as pas les droits pour lancer cette partie'`)
        }
        return true
    }

    @SubscribeMessage('messageLobby')
    receiveMsgLobby(@WsUser() user: User, @WsData() payload: { game_uid: string, msg: string }) : ErrorInterface | boolean
    {
        this.logger.log(`receiveMsgLobby() new message: room: ${user?.currentRoom?.uid}, message: ${payload.msg}`)
        this.roomsService.sendMessageToRoom(user, payload.msg)
        return true
    }
}
