
interface Block {
    x: number
    y: number
    item: number[][]
}

const square = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
]

export const I = [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
]

const L = [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
]

const Z = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
]

const T = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
]

export class Board
{

    board: Array<Array<number>> = []
    currentBlock: Block = null

    constructor() {

        for (let i = 0; i < 20; i++)
        {
            this.board[i] = new Array(10)

            for (let x = 0; x < 10; x++)
            {
                this.board[i][x] = 0
            }
        }
    }

    isCurrentPiece()
    {
        if (this.currentBlock === null)
            return false
        return true
    }

    setTetrisToBoard()
    {
        const spawn_margin = 4

        this.currentBlock = {
            y: 0,
            x: spawn_margin,
            item: T
        }
    }

    drawBlock()
    {
        let block = this.currentBlock
        let tmpBoard = JSON.parse(JSON.stringify(this.board));

        for (let i = 0; i < block.item.length; i++)
        {
            for (let y = 0; y < block.item.length; y++)
            {
                tmpBoard[i + block.y][y + block.x] = block.item[i][y]
            }
        }
        return tmpBoard
    }

    blackFall()
    {
        this.currentBlock.y++
    }

    getCurrentBoard()
    {
        return this.board
    }

    rotateTetris()
    {
        let element = this.currentBlock.item
        const length = element[0].length
        let new_array = []

        for (let i = 0; i < length; i++)
        {
            let new_line = element.map((line) => { return line[i] } ).reverse()
            new_array.push(new_line)
        }
        this.currentBlock.item = new_array
        return this.drawBlock()
    }

    translateTetris(value)
    {
        this.currentBlock.x += value
        return this.drawBlock()

    }
}