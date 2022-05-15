import User from "../../users/user";

export class LobbyDto {
    owner: User
    players: User[]
    name: string
    uid: string
    type: string
}