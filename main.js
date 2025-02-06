// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // DOM Elements
  const chatBox = document.getElementById('chatBox');
  const chatInput = document.getElementById('chatInput');
  
  // Listen for Auth State Changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      document.getElementById('loginPage').style.display = 'none';
      document.getElementById('mainContent').style.display = 'block';
  
      // Load chat messages
      loadChatMessages();
  
      // Listen for new messages
      listenForNewMessages();
    } else {
      // User is logged out
      document.getElementById('loginPage').style.display = 'block';
      document.getElementById('mainContent').style.display = 'none';
    }
  });
  
  // Load Chat Messages
  function loadChatMessages() {
    db.collection('messages')
      .orderBy('timestamp')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const message = doc.data();
          displayMessage(message);
        });
      })
      .catch((error) => {
        console.error('Error loading messages: ', error);
      });
  }
  
  // Listen for New Messages
  function listenForNewMessages() {
    db.collection('messages')
      .orderBy('timestamp')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const message = change.doc.data();
            displayMessage(message);
          }
        });
      });
  }
  
  // Display Message in Chat Box
  function displayMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `
      <span class="${message.role.toLowerCase()}">${message.username}</span>
      <span> (Level ${message.level}): ${message.text}</span>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  }
  
  // Send Message
  function sendMessage() {
    const text = chatInput.value.trim();
    if (text) {
      const user = auth.currentUser;
      if (user) {
        const message = {
          username: user.displayName || user.email,
          text: text,
          role: user.email === 'felon@example.com' ? 'Owner' : 'User', // Example role logic
          level: 1, // Example level logic
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };
  
        // Add message to Firestore
        db.collection('messages').add(message)
          .then(() => {
            chatInput.value = ''; // Clear input field
          })
          .catch((error) => {
            console.error('Error sending message: ', error);
          });
      }
    }
  }
  
  // Allow sending messages by pressing Enter
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  console.log("Email:", email); // Debugging
  console.log("Password:", password); // Debugging

  if (email && password) {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful! User:", user); // Debugging
        alert("Login successful! Welcome, " + user.email);
        window.location.href = "main.html"; // Redirect to main page
      })
      .catch((error) => {
        console.error("Error:", error); // Debugging
        alert("Error: " + error.message);
      });
  } else {
    alert("Please enter your email and password.");
  }
}
