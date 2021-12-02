import { Module } from '@nestjs/common';
import { GamesServices } from './games.services'
import { EventsServices } from "../events/events.services";


@Module({
    imports: [],
    controllers: [],
    providers: [EventsServices],
})

export class GamesModule {}
