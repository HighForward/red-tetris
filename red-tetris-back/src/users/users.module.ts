import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEventsGateway } from "./users-events.gateway";
import { EventsModule } from "../events/events.module";

@Module({
    imports: [forwardRef(() => EventsModule)],
  providers: [UsersService, UsersEventsGateway],
    exports: [UsersService]
})
export class UsersModule {}
