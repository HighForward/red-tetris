
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WsException } from "@nestjs/websockets";

export const WsUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const client = ctx.switchToWs().getClient();
        if (client.user)
            return client.user

        throw new WsException('user not found')
    },
);