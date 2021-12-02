import {Module} from "@nestjs/common";
import {AppGateway} from "./events.gateway";
import { EventsServices } from "./events.services";
import { GamesModule } from '../games/games.modules'
import { GamesServices } from "src/games/games.services";

@Module({
    imports: [GamesModule],
    controllers: [],
    providers: [AppGateway, EventsServices, GamesServices]
})

export class EventsModule {}

