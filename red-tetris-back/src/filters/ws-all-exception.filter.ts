import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsAllExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        console.log("salut les boys")
        super.catch(exception, host);
    }
}