function showPopup(name) {
  const popup = document.getElementById(name);
  popup.style.display = 'block';
}


function hidePopup(name) {
  const popup = document.getElementById(name);
  popup.style.display = 'none';
}


document.getElementById('newGameBtn').addEventListener('click', () => {
  console.log('New Game button clicked');
  fetch('/game/new',{
    method:'GET'
  }).then(response => {
    if (response.redirected) {
      window.location.href = response.url; 
    } else {
      console.log('Response received but not redirected:', response);
    }
  })
  .catch(error => {
    console.error('Error fetching new game:', error);
  });
});

document.getElementById('joinGameBtn').addEventListener('click', () => {

  console.log('Join a Game button clicked');

  hidePopup('popup');
  showPopup('join-popup')
});

document.getElementById('joinBtn').addEventListener('click', () => {

  console.log('Join button clicked');
  const gameId = document.querySelector('input[name="gameId"]').value;
  console.log(gameId)
  fetch('/game/join',{
    method:"POST",
    headers:{
      'Content-type': 'application/json',
    },
    body:JSON.stringify({joinId:gameId}),
    redirect:"follow"
  }).then(response=>{
    if (response.redirected) {
      window.location.href = response.url; 
    } else {
      console.log('Response received but not redirected:', response);
    }
  }).catch(error=>{
    console.error('Error joining the game:', error);
  })
 
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  console.log('Cancel button clicked');

  hidePopup('join-popup')
  showPopup('popup');
});


window.addEventListener('load', () => {
  const path = window.location.pathname;
  if (path === '/') {
    showPopup('popup');
  } else {
    hidePopup('popup');
    hidePopup('join-popup');
  }
});