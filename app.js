const Player = (sign) => {
    this.sign = sign 
    const getSign = () => {
        return sign
    }
    return {getSign}
}

const  gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', '']
    
    const setBox = (index, sign) => {
        if (index > board.length) return
        board[index] = sign
    } 
    const getBox = (index) => {
        if (index > board.length) return
        return board[index]
    }
    const reset = () => {
        board = ['', '', '', '', '', '', '', '', '']
    }
    return {setBox, getBox, reset}
})()

const playController = (() => {
    const firstPlayer = Player('X')
    const secondPlayer = Player('O')
    let _isGameOver = false
    let round = 1
    
  
    const playRound = (boxIndex) => {
        gameBoard.setBox(boxIndex, getCurrentPlayerSign())
        if (checkWinner(boxIndex)) {
            displayController.setResultMessage(getCurrentPlayerSign())
            _isGameOver = true
            return
        }
        if (round === 9){
            displayController.setResultMessage('Draw')
            _isGameOver = true
            return
        }
        round++
        displayController.setMessageElement(
            `Player ${getCurrentPlayerSign()}'s turn`
        )
    }
    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? firstPlayer.getSign() : secondPlayer.getSign()
    }
    
    const checkWinner = (boxIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
        return winConditions.filter((comb) => comb.includes(boxIndex))
                            .some((possibleComb) => possibleComb
                            .every((index) => gameBoard.getBox(index) === getCurrentPlayerSign()))
    }
    
    const getIsOver = () => {
        return _isGameOver
    }

    const reset = () => {
        round = 1
        _isGameOver = false
    }
    return {playRound, getIsOver, reset}  
    
})()

const displayController = (() => {
    const resetBoard = document.querySelector('.reset')
    const boxes = document.querySelectorAll('.box')
    const message = document.querySelector('.message')

    const updateBoard = () => {
        for (let i=0; i<boxes.length; i++) {
            boxes[i].textContent = gameBoard.getBox(i)
        }
    }

    boxes.forEach((box) => box.addEventListener('click', (e) => {
        if (playController.getIsOver() || e.target.textContent !== "") return
        playController.playRound(parseInt(e.target.dataset.index))
        updateBoard()
    })
)
    resetBoard.addEventListener('click', (e) => {
        gameBoard.reset()
        playController.reset()
        updateBoard()
        setMessageElement("Player X's turn")
    })


    const setResultMessage = (winner) => {
        if (winner === "Draw") {
            setMessageElement("It's a draw!")
        }else {
            setMessageElement(`Player ${winner} has won!`)
        }
    }
    const setMessageElement = (messageEl) => {
        message.textContent = messageEl
    }
    return {setResultMessage, setMessageElement}
})()
