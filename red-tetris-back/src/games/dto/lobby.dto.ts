import { UserInterface } from "src/events/interfaces/user.interface"

export class LobbyDto {
    owner: UserInterface
    players: UserInterface[] = []
    lobbyName: string
    game_uid: string
    type: string
}