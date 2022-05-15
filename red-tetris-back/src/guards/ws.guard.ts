import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from "socket.io";
import { UsersService } from "../users/users.service";
import User from "../users/user";

@Injectable()
export class WsGuard implements CanActivate {

    constructor(private readonly usersService: UsersService) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const client = context.switchToWs().getClient()
        let user: User = null
        if (!(user = this.usersService.findOneById(client.id)))
            return false

        client.user = user
        return true;
    }
}