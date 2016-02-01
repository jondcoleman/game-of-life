


////////////////////////////////// Routes
var Board = React.createClass({
  getInitialState: function() {
    return {game: undefined}
  },
  render: function() {
    return (
      <div>test</div>
    )
  }
})


var board = React.createElement(Board);

ReactDOM.render(board, document.getElementById('content'))
