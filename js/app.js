function createBoard(rows, cols, clear){
  var board = []
  for (var i = 0; i < rows; i++){
    board.push([])
  }
  board.forEach(function(row, index){
    for (var i = 0; i < cols; i++){
      if (clear) {
        var isLiving = false
      } else {
        var isLiving = randomTrueOrFalse()
      }
      row.push({living: isLiving, row: index, col: i})
    }
  })
  return board;
}

function randomTrueOrFalse(){
  return Math.round(Math.random()) === 0 ? false : true
}

var Cell = React.createClass({
  render: function() {
    var cellClass = this.props.cell.living ? "board-cell alive" : "board-cell"
    return <div className={cellClass} row={this.props.rowIndex} col={this.props.index} onClick={this.handleClick}></div>
  },
  handleClick: function(){
    this.props.giveLife(this.props.rowIndex, this.props.index)
  }
})

function getInterval(callback){
  return setInterval(function(){
    callback()
  }.bind(this), 500)
}

var Board = React.createClass({
  getInitialState: function() {
    return {board: [[]], height: 35, width: 50, generations: 0, gameTimer: false}
  },
  componentDidMount: function(){
    this.setState({board: createBoard(this.state.height, this.state.width, false)})
    this.autogen()
  },
  render: function() {
    return (
      <div className="board-container">
        <div className="board">{this.renderRows()}</div>
        <div className="btn btn-default play-button" onClick={this.autogen} disabled={this.state.gameTimer ? true : false}>Play</div>
        <div className="btn btn-default clear-button" onClick={this.clearBoard}>Clear</div>
        <div className="btn btn-default pause-button" onClick={this.pause}>Pause</div>
        <div className="lbl-generations"><h4>{this.state.generations + " Generations"}</h4></div>
      </div>
    )
  },
  renderRows: function(){
    return this.state.board.map(function(row, index){
      return <div className="board-row" key={index}>{this.renderCells(row, index)}</div>
    }.bind(this))
  },
  renderCells: function(row, rowIndex){
    return row.map(function(cell, index){
      return <Cell cell={cell} index={index} key={index} rowIndex={rowIndex} giveLife={this.giveLife}/>
    }.bind(this))
  },
  giveLife: function(x, y){
    var newBoard = this.state.board.slice()
    newBoard[x][y].living = true
    this.setState({board: newBoard})
  },
  clearBoard: function(){
    this.clearTimer()
    this.setState({board: createBoard(this.state.height, this.state.width, true), generations: 0})
  },
  autogen: function(){
    this.setState({gameTimer: getInterval(this.gen)})
  },
  pause: function(){
    this.clearTimer()
  },
  clearTimer: function(){
    clearInterval(this.state.gameTimer)
    this.setState({gameTimer: false})
  },
  gen: function(){
    //example at position 5, 5 I need ot check 8 cells surrounding: 4,4 | 4,5 | 4,6 | 5,4 | 5,6 | 6,4 | 6,5 | 6,6

    function countAliveFriends(state, adjacentPositions){
      var alive = {
        aliveCount: 0,
        aliveCells: []
      }
      adjacentPositions.forEach(function(position){
        var x = position[0]
        var y = position[1]
        if (x < 0 || y < 0 || x > state.height - 1 || y > state.width - 1) {
          return
        }
        if (state.board[x][y].living) {
          alive.aliveCount++
          alive.aliveCells.push([x, y])
        }
      })
      return alive //returning integer
    }


    var newBoard = []
    var state = this.state
    this.state.board.forEach(function(row){
      var newRow = row.map(function(cell){
        var adjacentPositions = []
        var newCell = {living: cell.living, row: cell.row, col: cell.col}
        adjacentPositions.push([cell.row - 1, cell.col - 1])
        adjacentPositions.push([cell.row - 1, cell.col])
        adjacentPositions.push([cell.row - 1, cell.col + 1])
        adjacentPositions.push([cell.row, cell.col - 1])
        adjacentPositions.push([cell.row, cell.col + 1])
        adjacentPositions.push([cell.row + 1, cell.col - 1])
        adjacentPositions.push([cell.row + 1, cell.col])
        adjacentPositions.push([cell.row + 1, cell.col + 1])
        var livingFriends = countAliveFriends(state, adjacentPositions)
        if (cell.living && (livingFriends.aliveCount < 2 || livingFriends.aliveCount > 3)) {
          newCell.living = false
        }
        if (!cell.living && livingFriends.aliveCount === 3) {
          newCell.living = true
        }
        return newCell
      })
      newBoard.push(newRow)
    })
    this.setState({board: newBoard, generations: this.state.generations + 1})
  }
})


var board = React.createElement(Board);

ReactDOM.render(board, document.getElementById('content'))
