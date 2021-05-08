let results = null;

async function postData(url = '', data = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json();
  }
  catch (e) {
    console.log("postData error");
    console.log(e.message);
  }
}

async function play() {
  let p1 = document.querySelector('#p1').value;
  let p2 = document.querySelector('#p2').value;
  let game = document.querySelector('#game').value;
  let games = document.querySelector('#games').value;
  let req = {
    "p1":p1,
    "p2":p2,
    "game":game,
    "games":games
  };
  let url = 'https://u54uysdcqj.execute-api.us-east-1.amazonaws.com/dev/match';
  console.log( JSON.stringify(req));
  try {
    results = await postData(url, req);
    document.querySelector('#results').textContent = JSON.stringify(results,null,2);

    let tally = results.results;
    let list = document.querySelector('#game_list');
    list.innerHTML = '';

    for (let i=0;i<tally.gameWinners.length;i++) {
      list.innerHTML += `<div class="game_entry" onclick="showgame(${i},this)" style="cursor:pointer;height:30px;border:1px solid gray;margin:3px;">Game #${i+1} Winner: ${tally.gameWinners[i].join(',')}</div>`;
    }

    let winner = tally.winners.length==2 ? "It's a tie!" :
      tally.winners[0] == "0" ? "Player #1" : "Player #2";
    list.innerHTML += `
      <div>Match Winner: ${winner}</div>
    `;

    list.innerHTML += `
      <input type="button" value="&#x23ee;" onclick="back()">
      <input type="button" value="&#9654;" onclick="playgame()">
      <input type="button" value="&#x23ed;" onclick="forward()">
    `;
    // Show the first game by default
    showgame(0);

  } catch(e) {
    console.log(e);
  }
}

let selected_game = 0;
let currentstate = 0;

function showgame(i) {
  selected_game = i;
  let selected = document.querySelector('.game_selected');
  if (selected) {
    selected.classList.remove('game_selected');
  }
  document.querySelector('#game_list').childNodes[i].classList.add('game_selected');

  let gamestates = results.state[i];
  let finalstate = gamestates[gamestates.length-1];
  currentstate = gamestates.length-1;
  document.querySelector('#game_render').contentWindow.postMessage(finalstate,"*");
}
function showcurrentstate() {
  let gamestates = results.state[selected_game] || [];
  let s = gamestates[currentstate];
  if (s) {
    document.querySelector('#game_render').contentWindow.postMessage(s, "*");
  }
}
function playgame() {
  let gamestates = results.state[selected_game];
  currentstate = 0;
  let show = ()=> {
    let s = gamestates[currentstate];
    if (s) {
      document.querySelector('#game_render').contentWindow.postMessage(s, "*");
      currentstate++;
      setTimeout(show, 500);
    }
    else {
      currentstate--; // reached end
    }
  };
  show();
}
function back() {
  currentstate--;
  if (currentstate<0) {
    currentstate = 0;
  }
  showcurrentstate();
}
function forward() {
  let gamestates = results.state[selected_game];
  currentstate++;
  if (currentstate>gamestates.length-1) {
    currentstate = gamestates.length-1;
  }
  showcurrentstate();

}
