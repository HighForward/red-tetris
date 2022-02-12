import { UserInterface } from '../../events/interfaces/user.interface'
import { UserDTO } from '../../events/interfaces/user.interface'
import { v4 as uuidv4 } from 'uuid';
import { Board, GameState } from './board'
import { SchedulerRegistry } from "@nestjs/schedule";
import { Server } from 'socket.io';
import { pieces } from './board'

export enum LobbyState {
    WARMING = 'WARMING',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED'
}

export enum LobbyType
{
    Solo = 'solo',
    Multi = 'multi'
}

export interface LobbyDTO {
    owner: UserDTO
    players: UserDTO[]
    state: LobbyState
    name: string
    type: LobbyType
    uid: string
    chat: string[]
}



export default class LobbyHandler
{
    owner: UserInterface = null
    players: UserInterface[] = []
    state: LobbyState = LobbyState.WARMING
    name: string = null
    type: LobbyType
    uid: string
    chat: string[] = []


    blocksPatern: number[] = []

    boards: Board[] = []

    constructor(owner: UserInterface, lobbyName: string, lobbyType: LobbyType) {
        this.owner = owner
        this.name = lobbyName
        this.type = lobbyType
        this.players.push(owner)
        this.uid = uuidv4()
        this.emitMsgToChat(`Création de la partie: '${lobbyName}'.`, owner)
    }

    loadBlocksPatern()
    {
        this.blocksPatern = []

        for (let i = 0; i <= 200; i++)
            this.blocksPatern.push(Math.floor(Math.random() * 7))
    }

    emitMsgToChat(msg: string, user: UserInterface = null)
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

    joinLobby(user: UserInterface)
    {
        this.players.push(user)
        const msg = `${user.username} à rejoint la partie.`
        this.emitMsgToChat(msg)
    }

    leaveLobby(user: UserInterface, schedulerRegistry: SchedulerRegistry, server: Server) : boolean
    {
        const index = this.players.findIndex((usertmp) => {return usertmp.id === user.id})
        if (index !== -1)
        {
            let board = this.getBoardOfUser(user)
            if (board && this.state === LobbyState.STARTED && board.state === GameState.Started)
                this.stopGame(board, schedulerRegistry, server)

            this.players.splice(index, 1)
        }

        if (this.owner.id === user.id)
        {
            if (this.players.length === 0) {
                return false
            }

            if (this.players.length) {
                this.owner = this.players[0]
                const ownerChange = `${this.owner.username} est maintenant chef.`
                this.emitMsgToChat(ownerChange)
            }
        }

        const msg = `${user.username} à quitter la partie.`

        this.emitMsgToChat(msg)
        return true
    }

    gameTrigger(board: Board, others: UserInterface[], schedulerRegistry: SchedulerRegistry, server)
    {
        let tmpBoard = undefined
        if (!(tmpBoard = board.gameLoop())) {
            this.stopGame(board, schedulerRegistry, server)
        }
        if (this.players.length > 1 && tmpBoard) {

            board.emitBoardToOthers(others, tmpBoard)
        }
    }

    startLobby(schedulerRegistry: SchedulerRegistry, server: Server)
    {
        this.state = LobbyState.STARTED
        this.emitMsgToChat(`La partie a commencer.`)

        this.loadBlocksPatern()

        this.players.forEach((user) => {

            let board = new Board(user, this.blocksPatern)
            board.state = GameState.Started
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
            this.state = LobbyState.WARMING
            this.emitMsgToChat(`Le vainqueur est ${board.player.username} !!`)

        }

        this.emitUpdateLobby()
        server.emit('updateLobbyList', this.toDTO())

        this.boards = this.boards.filter((tmp) => { return tmp.player.id !== board.player.id})

    }

    getBoardOfUser(user: UserInterface)
    {
        return this.boards.find((board) => { return (board.player.id === user.id)})
    }

    isPlayerOfLobby(user: UserInterface) : boolean
    {
        const tmp = this.players.filter((player) => player.id === user.id)
        return (tmp.length > 0 ? true : false)
    }

    pushNewMessage(user: UserInterface, msg: string)
    {
        if (this.isPlayerOfLobby(user))
        {
            this.emitMsgToChat(msg, user)
        }
    }

    toDTO() : LobbyDTO
    {
        return {
            players: this.players.map((user: UserInterface) : UserDTO => { return {
                username: user.username,
                id: user.id,
                type: user.type
            } }),
            owner: {username: this.owner.username, id: this.owner.id, type: this.owner.type},
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

    /** GAME PART **/

    rotateBlock(user: UserInterface)
    {
        let board = this.getBoardOfUser(user)
        if (board && board.state === GameState.Started)
        {
            let tmp_board = board.rotateTetris()
            board.updateBoard(board, tmp_board)

            if (this.players.length > 1 && tmp_board) {

                const others = this.players.filter((tmpuser) => { return tmpuser.id !== user.id })
                board.emitBoardToOthers(others, tmp_board)
            }
        }
    }

    translateBlock(user: UserInterface, value: number)
    {
        let board = this.getBoardOfUser(user)
        if (board && board.state === GameState.Started)
        {
            let tmp_board = board.translateTetris(value)
            board.updateBoard(board, tmp_board)

            if (this.players.length > 1 && tmp_board) {

                const others = this.players.filter((tmpuser) => { return tmpuser.id !== user.id })
                board.emitBoardToOthers(others, tmp_board)
            }
        }
    }

    fastDown(user: UserInterface, schedulerRegistry: SchedulerRegistry, server: Server)
    {
        let board = this.getBoardOfUser(user)
        if (board && board.state === GameState.Started) {
            const others = this.players.filter((tmpuser) => { return tmpuser.id !== user.id })

            this.gameTrigger(board, others, schedulerRegistry, server)
        }
    }
}