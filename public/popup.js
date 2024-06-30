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
    
    hidePopup('popup');
    
  });
  
  document.getElementById('joinGameBtn').addEventListener('click', () => {

    console.log('Join a Game button clicked');

    hidePopup('popup'); 
    showPopup('join-popup')
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    console.log('Cancel button clicked');
    
    hidePopup('join-popup')
    showPopup('popup');
  });
  

  