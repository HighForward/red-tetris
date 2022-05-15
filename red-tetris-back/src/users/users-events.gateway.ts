import { BaseWsExceptionFilter, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { UsersService } from "./users.service";
import { Body, Catch, Logger, Req, UseFilters, UseGuards } from "@nestjs/common";
import { WsGuard } from "../guards/ws.guard";
import { WsUser } from "../decorators/ws.user";
import { WsData } from "../decorators/ws-data.decorator";
import User, { UserDTO } from "./user";
import { EventsServices } from "../events/events.services";
import { WsExceptionsHandler } from "@nestjs/websockets/exceptions/ws-exceptions-handler";

@UseGuards(WsGuard)
@WebSocketGateway(Number(process.env.WS_PORT),
    { cors: '*:*' }
)
export class UsersEventsGateway {

    constructor(private readonly usersService: UsersService, private readonly eventsService: EventsServices){}
    private logger: Logger = new Logger(UsersEventsGateway.name);

    @SubscribeMessage('getGuestUsername')
    getGuestUsername(@WsUser() user: User)
    {
        this.logger.log(`getGuestUsername() user: ${user.id}`)
        return user.username
    }

    @SubscribeMessage('usernameSelected')
    updateUsername(@WsUser() user: User, @WsData() username: string) {
        let tmp_user = this.usersService.setUsername(user.id, username)
        this.logger.log(`updateUsername() user: ${user.id} updated his username`)
        this.eventsService.emitMessage('updateUsernameOnlineList', tmp_user.toDTO())
        return true
    }

    @SubscribeMessage('getUsersOnline')
    getUsersOnline(@WsUser() user: User) : UserDTO[]
    {
        try {
            this.logger.log(`getUsersOnline()`)
            const users = this.usersService.getUsers()
            return users.map((user) => {
                return user.toDTO()
            })
        } catch (e) {
            throw e
        }
    }

}