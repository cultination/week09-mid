import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

    const firebaseConfig = {
      apiKey: "AIzaSyDeIx46y88FO0-hbEY7ZG0C-QIQsAU4bLI",
      authDomain: "week09-89bc2.firebaseapp.com",
      projectId: "week09-89bc2",
      storageBucket: "week09-89bc2.appspot.com",
      messagingSenderId: "848489998994",
      appId: "1:848489998994:web:0be03b9a27fe1dee24544b",
      measurementId: "G-419ZDQPR80"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    export { app, db };
