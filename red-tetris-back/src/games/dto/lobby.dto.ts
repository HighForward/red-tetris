import { UserInterface } from "src/events/interfaces/user.interface"

export class LobbyDto {
    owner: UserInterface
    players: UserInterface[] = []
    name: string
    uid: string
    type: string
}