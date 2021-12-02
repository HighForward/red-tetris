import { UserInterface } from "src/events/interfaces/user.interface"
import {v4 as uuidv4} from 'uuid';
import { LobbyDto } from "../dto/lobby.dto";
import {Board} from "./board";
import {I} from "./board"

export enum LobbyType
{
    Solo = 'solo',
    Multi = 'multi'
}

export enum GameState
{
    Warm = 'warm',
    Started = 'started',
    Finished = 'finished'
}

export class Lobby {

    owner: UserInterface = undefined
    players: UserInterface[] = []
    lobbyName: string = ''
    game_uid: string
    type: string
    board: Board = undefined

    state: string

    constructor(owner: UserInterface, lobbyName: string, lobbyType: string) {
        this.owner = owner
        this.lobbyName = lobbyName
        this.game_uid = uuidv4()
        this.type = lobbyType
        this.board = new Board()
        this.state = GameState.Warm
    }

    gameLoop()
    {
        if (!this.board.isCurrentPiece())
            this.board.setTetrisToBoard()
        let tmpBoard = this.board.drawBlock()
        this.board.blackFall()

        this.owner.socket.emit('updateBoard', tmpBoard)

        // this.board.rotateTetris()
        // this.board.launchTetris()
    }

    rotateBlock()
    {
        let tmp_board = this.board.rotateTetris()
        this.owner.socket.emit('updateBoard', tmp_board)
    }

    translateBlock(value)
    {
        let tmp_board = this.board.translateTetris(value)
        this.owner.socket.emit('updateBoard', tmp_board)
    }

    toDTO()
    {
        return {
            owner: this.owner.username,
            lobbyName: this.lobbyName,
            game_uid: this.game_uid,
            type: this.type,
            state: this.state
        }
    }

}