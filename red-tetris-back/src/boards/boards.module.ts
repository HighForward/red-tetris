import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service'
import { EventsServices } from "../events/events.services";
import { BoardsEventGateway } from "./boards-event.gateway";
import { UsersModule } from "../users/users.module";
import { RoomsModule } from "../rooms/rooms.module";


@Module({
    imports: [UsersModule],
    controllers: [],
    providers: [BoardsService, BoardsEventGateway],
    exports: [BoardsService]
})

export class BoardsModule {}
