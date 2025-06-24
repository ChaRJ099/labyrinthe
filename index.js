const BASE_URL = "https://hire-game-maze.pertimm.dev/";

async function startGame() {
  try {
    const response = await fetch(`${BASE_URL}start-game/`, {
      method: "POST",
      headers: {
        // "Content-type": "application/json"
        "Content-Type": "application/x-www-form-urlencoded",
      },
      //   body: JSON.stringify({ player: "chacha" }),
      body: "player=chacha",
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", data);

    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response}`);
    }

    return data;
  } catch (error) {
    console.error("Erreur dans startGame :", error);
    throw error;
  }
}
startGame();

// async function main() {
//   try {
//     const gameData = await startGame();

//     console.log("Jeu lancé avec succès");
//     console.log(
//       "Coordonnées de départ :",
//       gameData.position_x,
//       gameData.position_y
//     );
//     console.log("gameData", gameData);
//   } catch (error) {
//     console.error("Erreur dans le processus :", error.message);
//   }
// }

// main();
