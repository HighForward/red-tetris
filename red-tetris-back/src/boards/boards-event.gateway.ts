import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { BoardsService } from "./boards.service";
import { UsersService } from "../users/users.service";
import { UseGuards } from "@nestjs/common";
import { WsGuard } from "../guards/ws.guard";
import { WsUser } from "../decorators/ws.user";
import { WsData } from "../decorators/ws-data.decorator";
import User from "../users/user";

@UseGuards(WsGuard)
@WebSocketGateway(Number(process.env.WS_PORT),
    { cors: '*:*' }
)
export class BoardsEventGateway {

    constructor(private readonly boardsService: BoardsService) {
    }

    @WebSocketServer() server: Server

    @SubscribeMessage('rotateBlock')
    rotateBlock(@WsUser() user: User, @WsData() game_uid: string)
    {
        this.boardsService.rotateBlock(user)
    }

    @SubscribeMessage('translateBlock')
    translateBlock(@WsUser() user: User, @WsData() payload: { game_uid: string, value: number })
    {
        this.boardsService.translateBlock(user, payload.value)
    }

    @SubscribeMessage('fastDown')
    fastDown(@WsUser() user: User, @WsData() game_uid: string)
    {
        this.boardsService.fastDown(user, game_uid, this.server)
    }

    @SubscribeMessage('instantDown')
    instantDown(@WsUser() user: User, @WsData() game_uid: string)
    {
        this.boardsService.instantDown(user, game_uid, this.server)
    }

}