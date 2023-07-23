// app.js (or any other client-side JavaScript file)

// Function to show the popup
function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
  }
  
  // Function to hide the popup
  function hidePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
  }
  
  // Attach event listeners to the buttons
  document.getElementById('newGameBtn').addEventListener('click', () => {
    // Handle the New Game button click
    console.log('New Game button clicked');
    // You can perform any actions here, such as starting a new game instance, etc.
    hidePopup(); // Hide the popup after the button click
  });
  
  document.getElementById('joinGameBtn').addEventListener('click', () => {
    // Handle the Join a Game button click
    console.log('Join a Game button clicked');
    // You can perform any actions here, such as joining an existing game room, etc.
    hidePopup(); // Hide the popup after the button click
  });
  

  