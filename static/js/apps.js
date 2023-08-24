// Sample data for game cards (customize as needed)
const gameData = [
    { id: 0, title: "Spotify", function: "launchURL('spotify.com')" }, 
    { id: 0, title: "Discord", function: "launchURL('discord.com/app')" },
    { id: 0, title: "Youtube", function: "launchURL('youtube.com')" }, 
    { id: 0, title: "Google", function: "launchURL('google.com')" }, 
    { id: 0, title: "Anime", function: "launchURL('aniwatch.to')" }, 
    { id: 0, title: "Chat GPT No Login", function: "launchURL('chat.chatgptdemo.net')" }, 
    { id: 0, title: "Moview", function: "launchURL('ww9.0123movies.net')" }, 




    // Add more game data here for all 200 game cards
];

// Function to generate game cards
function generateGameCards() {
    const container = document.getElementById("gameCardsContainer");

    gameData.forEach((game) => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.setAttribute("data-id", game.id); // Add a data-id attribute
        card.innerHTML = `
            <h1 class="game-title">${game.title}</h1>
            <button class="play-button" data-function="${game.function}">Play Now</button>
        `;
        container.appendChild(card);
    });
}

// Initial generation of game cards
generateGameCards();

// Add click event listeners to the "Play Now" buttons
document.querySelectorAll(".play-button").forEach((button) => {
    button.addEventListener("click", function () {
        const functionName = this.getAttribute("data-function");
        // Call the JavaScript function based on the data-function attribute
        if (window[functionName] && typeof window[functionName] === "function") {
            window[functionName]();
        } else {
            console.error(`Function ${functionName} not found.`);
        }
    });
});

