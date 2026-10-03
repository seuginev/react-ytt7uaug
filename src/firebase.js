<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBaBeJbcuM-crVrU5Wifjoiy6fyf2I4GzI",
    authDomain: "d-ranch-aef75.firebaseapp.com",
    databaseURL: "https://d-ranch-aef75-default-rtdb.firebaseio.com",
    projectId: "d-ranch-aef75",
    storageBucket: "d-ranch-aef75.firebasestorage.app",
    messagingSenderId: "821724942056",
    appId: "1:821724942056:web:898b8f3d1b20edaf90c35d",
    measurementId: "G-B48RQK044Q"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>