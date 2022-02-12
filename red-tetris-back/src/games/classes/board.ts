 import { UserInterface } from "src/events/interfaces/user.interface"

interface Block {
    x: number
    y: number
    item: number[][]
}

const square = [
    [1, 1],
    [1, 1],
]

export const I = [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]

const L = [
    [3, 0, 0],
    [3, 3, 3],
    [0, 0, 0],
]

const Lr = [
    [0, 0, 4],
    [4, 4, 4],
    [0, 0, 0],
]

const Z = [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
]

const T = [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
]

const Zr = [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
]

export const pieces = [
    square, T, Z, L, I, Zr, Lr
]

export enum GameState
{
    Warm = 'WARM',
    Started = 'STARTED',
    Finished = 'FINISHED'
}

interface BoardDTO {

    player: UserInterface
    state: GameState
    score: number
    board: Array<Array<number>>
    currentBlock?: Block
}

export class Board
{

    player: UserInterface
    state: GameState
    board: Array<Array<number>> = []
    currentBlock: Block = null
    blockPatern: number[]
    blockIndex: number = 0
    score: number = 0

    constructor(owner: UserInterface, blockPatern: number[]) {

        this.player = owner
        this.state = GameState.Warm
        this.blockPatern = blockPatern

        for (let i = 0; i < 20; i++)
        {
            this.board[i] = new Array(10)

            for (let x = 0; x < 10; x++)
            {
                this.board[i][x] = 0
            }
        }
    }

    gameLoop()
    {
        let tmpBoard = null

        tmpBoard = this.blockFall()

        if (!tmpBoard)
        {
            this.updateBoard(this, this.getCurrentBoard())
            return undefined
        }
        else
            this.updateBoard(this, tmpBoard)
        return tmpBoard
    }

    emitBoardToOthers(others: UserInterface[], tmpBoard: number[])
    {
        const currentBoardDTO = {
            player: {
                id: this.player.id,
                username: this.player.username,
                type: this.player.type
            },
            score: this.score,
            board: tmpBoard
        }
        others.forEach((user) => {
            user.socket.emit('getLobbyBoards', currentBoardDTO)
        })
    }

    updateBoard(board: Board, tmpboard: number[][])
    {
        let fakeBoard = board.toDTO()

        fakeBoard.board = tmpboard
        this.player.socket.emit('updateBoard', fakeBoard)
    }


    isCurrentPiece()
    {
        if (this.currentBlock === null)
            return false
        return true
    }

    getLast10Pieces(index: number)
    {
        let tmp = []
        for (let x = 0; x < 10; x++)
            tmp.push(pieces[this.blockPatern[index + x]])

        return tmp
    }


    getBlockWithPatern()
    {
        let piece = pieces[this.blockPatern[this.blockIndex]]
        if (this.blockIndex === 200)
            this.blockIndex = 0

        if (this.blockIndex % 5 === 0)
            this.player.socket.emit('Last10Pieces', this.getLast10Pieces(this.blockIndex))

        this.player.socket.emit('blockValidate', true)

        this.blockIndex++

        return piece
    }

    setTetrisToBoard()
    {
        const spawn_margin = 4

        this.currentBlock = {
            y: 0,
            x: spawn_margin,
            item: this.getBlockWithPatern()

        }

        if (!this.canBlockBeInserted(this.currentBlock.item))
            return false
        return true
    }

    isTetrisBlock(val: number)
    {
        return [1, 2, 3, 4, 5, 6, 7].includes(val)
    }

    //false draw on copy and return, true draw on real board
    drawBlock(board = false)
    {
        let block = this.currentBlock

        let boardToDraw = undefined

        if (!board)
            boardToDraw = JSON.parse(JSON.stringify(this.board));
        else
            boardToDraw = this.board

        for (let y = 0; y < block.item.length; y++)
        {
            for (let x = 0; x < block.item.length; x++)
            {
                if (this.isTetrisBlock(block.item[y][x]))
                    boardToDraw[y + block.y][x + block.x] = block.item[y][x]
            }
        }
        return boardToDraw
    }

    getLastBoundVertical(col: number)
    {
        let lastHit = -1

        let blockLength = this.currentBlock.item[0].length

        for (let y = 0; y < blockLength; y++)
        {
            if (this.isTetrisBlock(this.currentBlock.item[y][col]))
                lastHit = y
        }
        return (lastHit === -1 ? -1 : lastHit + 1)
    }

    getBoundsVertical()
    {
        const pieceLength = this.currentBlock.item[0].length

        for (let col = 0; col < pieceLength; col++)
        {
            const lastYBound = this.getLastBoundVertical(col)

            if (lastYBound === -1)
                continue

            if ((this.currentBlock.y + lastYBound > 19 || this.isTetrisBlock(this.board[this.currentBlock.y + lastYBound][this.currentBlock.x + col]))) {
                return true
            }
        }
        return false
    }

    getLastBoundHorizontal(row: number, block)
    {
        let lastHit = -1
        let firstHit = -1

        let blockLength = this.currentBlock.item[0].length

        for (let x = 0; x < blockLength; x++)
        {
            if (this.isTetrisBlock(block[row][x])) {
                if (firstHit === -1)
                    firstHit = x
                lastHit = x
            }
        }

        return ({firstHit: firstHit, lastHit: lastHit})
    }

    getBoundsHorizontal(value: number, block = this.currentBlock.item)
    {
        const pieceLength = this.currentBlock.item[0].length

        for (let row = 0; row < pieceLength; row++) {

            let {firstHit, lastHit} = this.getLastBoundHorizontal(row, block)

            if (firstHit !== -1 && lastHit !== -1)
            {
                if (this.currentBlock.x + lastHit + value > 9)
                    return false
                if (this.currentBlock.x + firstHit + value < 0)
                    return false
                if (value > 0 && this.isTetrisBlock(this.board[this.currentBlock.y + row][this.currentBlock.x + lastHit + 1]))
                    return false
                if (value < 0 && this.isTetrisBlock(this.board[this.currentBlock.y + row][this.currentBlock.x + firstHit - 1]))
                    return false
            }
        }
        return true
    }

    checkLastRow()
    {
        if (this.board[0].filter((item) => { return this.isTetrisBlock(item) }).length)
        {
            return true
        }
        return false
    }

    removeFullRow()
    {
        let score_coef = 0
        for (let row = 0; row < this.board.length; row++)
        {
            if (this.board[row].filter((block) => block === 0).length === 0)
            {
                this.board[row] = this.board[row].fill(0)

                while (row > 0)
                {
                    this.board[row] = this.board[row - 1].map((item) => { return item })
                    row--
                }
                this.board[0].fill(0)
                score_coef++
            }
        }
        this.score += ((10 * score_coef) + (5 * score_coef))
    }

    blockFall()
    {
        let tmp_board = null

        if (!this.isCurrentPiece()) {
            this.setTetrisToBoard()
        }
        //when block cant fall, process bounds and reset pieces
        else if (this.getBoundsVertical()) {

            this.drawBlock(true)
            this.removeFullRow()

            //return null on no space left for next block (stop game)
            if (!this.setTetrisToBoard())
                return null
        }
        else {
            this.currentBlock.y++
        }

        tmp_board = this.drawBlock()
        return tmp_board
    }

    getCurrentBoard()
    {
        return this.board
    }

    performRotation()
    {
        let element = this.currentBlock.item
        const length = element[0].length
        let new_array = []

        for (let i = 0; i < length; i++)
        {
            let new_line = element.map((line) => { return line[i] } ).reverse()
            new_array.push(new_line)
        }
        return new_array
    }

    canBlockBeInserted(rotated_block)
    {
        let block = rotated_block

        for (let y = 0; y < block.length; y++)
        {
            for (let x = 0; x < block.length; x++)
            {
                if (this.isTetrisBlock(block[y][x]) && y + this.currentBlock.y >= 0) {

                    if (this.isTetrisBlock(this.board[y + this.currentBlock.y][x + this.currentBlock.x])) {
                        return false
                    }

                    if (!this.getBoundsHorizontal(0, block))
                        return false
                }
            }
        }
        return true
    }

    rotateTetris()
    {
        let rotated_block = this.performRotation()
        //check for outof bounds and if its not rotating on existing block
        if (this.canBlockBeInserted(rotated_block)) {
            this.currentBlock.item = rotated_block
        }
        return this.drawBlock()
    }

    translateTetris(value)
    {
        if (this.getBoundsHorizontal(value))
            this.currentBlock.x += value
        return this.drawBlock()
    }

    fastDown()
    {
        return this.blockFall()
    }

    toDTO()
    {
        const boardDTO: BoardDTO = {
            player: {
                id: this.player.id,
                username: this.player.username,
                type: this.player.type
            },
            score: this.score,
            board: this.board,
            // currentBlock: this.currentBlock,
            state: this.state
        }
        return boardDTO
    }
}