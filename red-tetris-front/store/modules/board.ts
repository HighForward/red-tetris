import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { UserInterface, LobbyInterface, BoardInterface } from '@/types/gametype'

@Module({
    name: 'board',
    stateFactory: true,
    namespaced: true,
})
export default class Board extends VuexModule {

    public currentBoard: BoardInterface | null = null

    public Last10Pieces: [] = []

    public boardList: BoardInterface[] = []

    get getBoard(): BoardInterface | null {
        return this.currentBoard
    }

    get getBoardList(): BoardInterface[] {
        return this.boardList
    }

    get getLast5Pieces(): [] {

        let tmp: [] = []

        for (let i = 0; i < 5; i++)
            tmp.push(this.Last10Pieces[i])

        return tmp
    }

    @Mutation
    updateLast10Pieces(array: []) : void {
        this.Last10Pieces = array
    }

    @Mutation
    removeFirstPiece() : void {
        if (this.Last10Pieces.length)
            this.Last10Pieces.splice(0, 1)
    }


    @Mutation
    updateBoard(board: BoardInterface | null) : void {
        this.currentBoard = board
    }

    @Mutation
    updateBoardList(boards: BoardInterface[]) : void {
        this.boardList = boards
    }

    @Mutation
    updateBoardArray(board: number[][]) : void {
        if (this.currentBoard)
            this.currentBoard.board = board
    }

}