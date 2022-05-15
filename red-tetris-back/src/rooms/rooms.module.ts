import { forwardRef, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { UsersModule } from "../users/users.module";
import { BoardsModule } from "../boards/boards.module";
import { RoomEventsGateway } from "./room-events.gateway";
import { EventsModule } from "../events/events.module";

@Module({
    imports: [UsersModule, forwardRef(() => EventsModule)],
  providers: [RoomsService, RoomEventsGateway],
    exports: [RoomsService]
})
export class RoomsModule {}
