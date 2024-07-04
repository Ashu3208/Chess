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
  }).then(response =>response.json())
   .then(data=>{
      if(data.joinGameId) {
        window.localStorage.setItem('roomId', data.joinGameId);
      }
      if (data.roomUrl) {
        window.localStorage.setItem('roomUrl', data.roomUrl); 
        window.location.href = `/game/${data.newGameId}`; 
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


const modal = document.querySelector("#modal");
const openModal = document.querySelector(".open-button");
const closeModal = document.querySelector(".close-button");

openModal.addEventListener("click", () => {
  const storedRoomUrl = window.localStorage.getItem('roomUrl');
  const storedRoomId = window.localStorage.getItem('roomId');
  if (storedRoomUrl) {
    const roomUrl = document.querySelector('#roomUrl');
    roomUrl.textContent = storedRoomUrl; 
  }
  if (storedRoomId) {
    const roomId = document.querySelector('#roomId');
    roomId.textContent=storedRoomId  
  }
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});
