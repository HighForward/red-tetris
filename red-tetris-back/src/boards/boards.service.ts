import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Server } from 'socket.io';
import User from "../users/user";
import { GameState } from "./board";

@Injectable()
export class BoardsService {
    constructor(
        private schedulerRegistry: SchedulerRegistry
    ) {}

    isBoardStarted(user: User) : boolean
    {
        return (user.currentBoard && user.currentBoard.state === GameState.Started && user.currentBoard.current_block !== null)
    }


    rotateBlock(user: User)
    {
        if (this.isBoardStarted(user))
        {
            const tmp_bord = user.currentBoard.rotateTetris()
            user.currentRoom.emitBoardToOthers(user, tmp_bord)
        }
    }

    translateBlock(user: User, value: number)
    {
        if (this.isBoardStarted(user))
        {
            const tmp_bord = user.currentBoard.translateTetris(value)
            user.currentBoard.updateBoard(user.currentBoard, tmp_bord)
            user.currentRoom.emitBoardToOthers(user, tmp_bord)
        }
    }

    fastDown(user: User, game_uid: string, server: Server)
    {
        if (this.isBoardStarted(user))
        {
            const others = user.currentRoom.getOthers(user)
            user.currentRoom.gameTrigger(user.currentBoard, others, this.schedulerRegistry, server)

        }
    }

    instantDown(user: User, game_uid: string, server: Server)
    {
        if (this.isBoardStarted(user))
        {
            user.currentRoom.instantDown(user, this.schedulerRegistry, server)
            //fallback scheduler here, trigger by returned values
        }
    }

}