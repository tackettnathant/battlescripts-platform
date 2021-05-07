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
  let games = document.querySelector('#games').value;
  let req = {
    "p1":p1,
    "p2":p2,
    "games":games
  };
  let url = 'https://u54uysdcqj.execute-api.us-east-1.amazonaws.com/dev/match';
  console.log( JSON.stringify(req));
  try {
    let results = await postData(url, req);
    document.querySelector('#results').textContent = JSON.stringify(results,null,2);

    let states = [];
    results.state.forEach(gs=>{
      gs.forEach(s=>{
        states.push(s);
      })
    });
    let showNextState = function() {
      if (states.length) {
        let s = states.shift();
        document.querySelector('#game_render').contentWindow.postMessage(s,"*");
      }
      setTimeout(showNextState,200);
    };
    showNextState();

  } catch(e) {
    console.log(e);
  }

}
