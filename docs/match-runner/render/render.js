function render(state) {
  let sq = s=>{
    let t = (s===null?"&nbsp;": s==="0"?"X": "O");
    return `<td class="${s===null?'':t}">${t}</td>`;
  };
  let b = state.board;
  let html = `<table id="board">
      <tr> ${sq(b[0][0])} ${sq(b[0][1])} ${sq(b[0][2])} </tr>
      <tr> ${sq(b[1][0])} ${sq(b[1][1])} ${sq(b[1][2])} </tr>
      <tr> ${sq(b[2][0])} ${sq(b[2][1])} ${sq(b[2][2])} </tr>
    </table>`;
  document.body.innerHTML = html;
}
