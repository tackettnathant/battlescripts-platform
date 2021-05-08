function render(state) {
  let sq = (row,col)=>{
    let s = state.board[row][col];
    let t = (s===null?"&nbsp;": s==="0"?"X": "O");
    let className = '';
    let w = state.winning_moves;
    if (w) {
      if (w[0][0]==row && w[0][1]==col) { className="win"; }
      if (w[1][0]==row && w[1][1]==col) { className="win"; }
      if (w[2][0]==row && w[2][1]==col) { className="win"; }
    }
    return `<td class="${s===null?'':t} ${className}">${t}</td>`;
  };
  let b = state.board;
  let html = `<table id="board">
      <tr> ${sq(0,0)} ${sq(0,1)} ${sq(0,2)} </tr>
      <tr> ${sq(1,0)} ${sq(1,1)} ${sq(1,2)} </tr>
      <tr> ${sq(2,0)} ${sq(2,1)} ${sq(2,2)} </tr>
    </table>`;
  document.body.innerHTML = html;
}
