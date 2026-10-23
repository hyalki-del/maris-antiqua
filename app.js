// Import Firebase SDK modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onUpdate, updateDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace these with your actual Firebase project configuration keys
const firebaseConfig = {
    apiKey: "AIzaSyD-WtE-nbSz7Ogus-Y06jaVp-YKMdc66yo",
    authDomain: "maris-91ddf.firebaseapp.com",
    projectId: "maris-91ddf",
    storageBucket: "maris-91ddf.firebasestorage.app",
    messagingSenderId: "101442635113",
    appId: "1:101442635113:web:c5241d6eec103dbd5ca9f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generate a unique ID for this browser session (Player)
const playerId = 'captain_' + Math.random().toString(36).substr(2, 9);
const playerName = prompt("Enter your Captain Name:") || "Anonymous Thalassocrat";

// Reference to this player's state in Firestore
const playerRef = doc(db, "games", "maris_main_room", "players", playerId);

// Register player on load
setDoc(playerRef, {
    name: playerName,
    talents: 3,
    momentum: 0,
    glory: 0,
    command: "None"
});

// Function triggered when player clicks an action button
window.submitAction = async function(actionType) {
    document.getElementById('my-command').innerText = actionType;
    await updateDoc(playerRef, {
        command: actionType
    });
};

// Real-time listener for global game state and active players
const globalGameRef = doc(db, "games", "maris_main_room");
onSnapshot(globalGameRef, (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('game-phase').innerText = `Phase: ${data.phase || "Active"}`;
        document.getElementById('wind-card').innerText = `Wind & Tide: ${data.windCard || "Etesian Winds"}`;
        document.getElementById('threat-track').innerText = `Sea Peoples Threat: ${data.seaPeoplesThreat || 0} / 10`;
    } else {
        // Initialize default room state if it doesn't exist yet
        setDoc(globalGameRef, {
            phase: "Action Phase",
            windCard: "Sirocco Blows North",
            seaPeoplesThreat: 2
        });
    }
});

// Real-time listener for all active players
const playersCol = collection(db, "games", "maris_main_room", "players");
onSnapshot(playersCol, (snapshot) => {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';
    
    snapshot.forEach((doc) => {
        const p = doc.data();
        const li = document.createElement('li');
        li.innerText = `${p.name} — Talents: ${p.talents} | Momentum: ${p.momentum} | Glory: ${p.glory} | Command: [ ${p.command} ]`;
        playerList.appendChild(li);
    });
});
