
declare enum GameState
{
    WARM = 'WARM',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED'
}

export enum LobbyState {
    WARMING = 'WARMING',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED'
}

export enum UserTypeState
{
    GUEST = 'GUEST',
    USERNAME = 'USERNAME',
    NONE = 'NONE'
}

export interface UserInterface
{
    id: string;
    username: string;
    type: UserTypeState
}

export interface LobbyInterface
{
    owner: UserInterface
    players: UserInterface[]
    name: string
    uid: string
    type: string
    chat: string[]
    state: LobbyState
}

export interface ErrorInterface
{
    error: string
}

export interface Pos {
  x: number
  y: number
}

export interface BoardInterface
{
    player: UserInterface
    state: GameState
    score: number
    board: Array<Array<number>>
    currentBlock?: Pos[]
}

export interface UpdateUsersOnline {
  user: UserInterface,
  online: boolean
}
