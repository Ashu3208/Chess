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
  fetch('/new-game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      const newGameId = data.gameId;
      console.log('New game created with ID:', newGameId);
      window.location.href = `/game/${newGameId}`;
    })
    .catch(error => {
      console.error('Error creating new game:', error);
    });
});

document.getElementById('joinGameBtn').addEventListener('click', () => {

  console.log('Join a Game button clicked');

  hidePopup('popup');
  showPopup('join-popup')
});

document.getElementById('joinBtn').addEventListener('click', () => {

  console.log('Join button clicked');
  const gameIdInput = document.querySelector('input[name="gameId"]');
  const gameId = gameIdInput.value;
  console.log(gameId)
  if (gameId) {
    console.log('Joining game with ID:', gameId);
    window.location.href = `/game/${gameId}`;
  } else {
    console.error('Game ID is required to join a game.');
  }

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