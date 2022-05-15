import { Module } from "@nestjs/common";
import { AppGateway } from "./events.gateway";
import { EventsServices } from "./events.services";
import { UsersModule } from "../users/users.module";
import { RoomsModule } from "../rooms/rooms.module";

@Module({
    imports: [RoomsModule, UsersModule],
    controllers: [],
    providers: [AppGateway, EventsServices],
    exports: [EventsServices],
})

export class EventsModule {
}

