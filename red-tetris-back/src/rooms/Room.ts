import { v4 as uuidv4 } from 'uuid';
import { Board, GameState } from '../boards/board'
import { SchedulerRegistry } from "@nestjs/schedule";
import { Server } from 'socket.io';
import { pieces } from '../boards/board'
import User, { UserDTO } from "../users/user";

export enum RoomState {
    WARMING = 'WARMING',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED'
}

export enum RoomType
{
    Solo = 'solo',
    Multi = 'multi'
}

export interface RoomDTO {
    owner: UserDTO
    players: UserDTO[]
    state: RoomState
    name: string
    type: RoomType
    uid: string
    chat: string[]
}



export default class Room
{
    owner: User = null
    players: User[] = []
    state: RoomState = RoomState.WARMING
    name: string = null
    type: RoomType
    uid: string
    chat: string[] = []


    block_loop: number[] = []

    boards: Board[] = []

    constructor(owner: User, lobbyName: string, lobbyType: RoomType) {
        this.owner = owner
        this.name = lobbyName
        this.type = lobbyType
        this.players.push(owner)
        this.uid = uuidv4()
        this.emitMsgToChat(`Création de la partie: '${lobbyName}'.`, owner)
    }

    loadBlocksLoop()
    {
        this.block_loop = []

        for (let i = 0; i <= 200; i++)
            this.block_loop.push(Math.floor(Math.random() * 7))
    }

    emitMsgToChat(msg: string, user: User = null)
    {
        const date = new Date()
        const hour = date.getHours()
        const minutes = date.getMinutes()

        let final_msg = `[${hour}:${minutes}] `

        if (user)
            final_msg += `${user.username}: `

        final_msg += msg

        this.chat.push(final_msg)

        this.players.forEach((user) => {
            user.socket.emit('updateChat', final_msg)
        })
    }

    joinLobby(user: User)
    {
        user.currentRoom = this
        this.players.push(user)
        const msg = `${user.username} à rejoint la partie.`
        this.emitMsgToChat(msg)
    }

    leaveLobby(user: User, schedulerRegistry: SchedulerRegistry, server: Server) : boolean
    {
        if (user.currentBoard && user.currentBoard.state === GameState.Started && this.state === RoomState.STARTED)
            this.stopGame(user.currentBoard, schedulerRegistry, server)

        const user_index = this.players.findIndex((user) => user.id === user.id)
        this.players.splice(user_index, 1)

        if (this.owner.id === user.id && this.players.length)
        {
            this.owner = this.players[0]
            this.emitMsgToChat(`${user.username} à quitter la partie.`)
            this.emitMsgToChat(`${this.owner.username} est maintenant chef.`)
            return true
        }
        return false
    }

    gameTrigger(currentBoard: Board, others: User[], schedulerRegistry: SchedulerRegistry, server)
    {
        const {board, malusRow} = currentBoard.gameLoop()

        if (malusRow && malusRow.nb > 0)
            this.addRowToOther(malusRow.user, malusRow.nb)

        if (!board) {
            this.stopGame(currentBoard, schedulerRegistry, server)
        }

        if (this.players.length > 1 && board) {
            currentBoard.emitBoardToOthers(others, board)
        }
    }

    startLobby(schedulerRegistry: SchedulerRegistry, server: Server)
    {
        this.state = RoomState.STARTED
        this.emitMsgToChat(`La partie a commencer.`)

        this.loadBlocksLoop()

        this.players.forEach((user) => {

            let board = new Board(user, this.block_loop)
            board.state = GameState.Started
            user.currentBoard = board
            this.boards.push(board)

            const others = this.players.filter((tmpuser) => { return tmpuser.id !== user.id })

            const interval = setInterval(() => {

                this.gameTrigger(board, others, schedulerRegistry, server)

            }, 1000)

            schedulerRegistry.addInterval(this.uid + ':' + user.id, interval)

            user.socket.emit('startLobby', this.toDTO())
            board.updateBoard(board, board.getCurrentBoard())
        })
    }

    stopGame(board: Board, schedulerRegistry: SchedulerRegistry, server: Server) {
        board.state = GameState.Finished
        schedulerRegistry.deleteInterval(this.uid + ':' + board.player.id)

        board.player.socket.emit('CurrentBoardStop', board.toDTO())

        this.emitMsgToChat(`La partie de ${board.player.username} s'est terminé. [${this.boards.length - 1}/8] parties restantes`)

        if (this.boards.filter((board) => { return (board.state === GameState.Started)}).length === 0)
        {
            this.state = RoomState.WARMING
            this.emitMsgToChat(`Le vainqueur est ${board.player.username} !!`)
        }

        this.emitUpdateLobby()
        server.emit('updateLobbyList', this.toDTO())


        this.boards = this.boards.filter((tmp) => { return tmp.player.id !== board.player.id})
    }

    toDTO() : RoomDTO
    {
        return {
            players: this.players.map((user: User) : UserDTO => { return user.toDTO() }),
            owner: this.owner.toDTO(),
            name: this.name,
            uid: this.uid,
            type: this.type,
            state: this.state,
            chat: this.chat
        }
    }

    emitUpdateLobby()
    {
        this.players.forEach((user) => {
            user.socket.emit('updateLobby', this.toDTO())
        })
    }

    getOthers(user: User)
    {
        return this.players.filter((tmp_user) => {
            return tmp_user.id !== user.id
        })
    }

    /** GAME PART **/

    emitBoardToOthers(user: User, tmp_board: number[][]) {
        if (this.players.length > 1 && tmp_board) {
            const others = this.players.filter((tmp_user) => {
                return tmp_user.id !== user.id
            })
            user.currentBoard.emitBoardToOthers(others, tmp_board)
        }
    }

    addRowToOther(user: User, size: number)
    {
        let boards = this.boards.filter((board) => board.player.id !== user.id)
        if (boards.length)
        {
            boards.forEach((board) => {
                board.addUnbreakableRow(size)
            })
        }

    }

    instantDown(user: User, schedulerRegistry: SchedulerRegistry, server: Server)
    {
            const others = this.getOthers(user)

            let { board, malusRow } = user.currentBoard.instantDown()

            if (malusRow && malusRow.nb)
                this.addRowToOther(malusRow.user, malusRow.nb)

            user.currentBoard.updateBoard(user.currentBoard, board)
            if (!board)
                this.stopGame(user.currentBoard, schedulerRegistry, server)

            if (this.players.length > 1 && board) {

                const others = this.players.filter((tmp_user) => { return tmp_user.id !== user.id })
                user.currentBoard.emitBoardToOthers(others, board)
            }
        }
}