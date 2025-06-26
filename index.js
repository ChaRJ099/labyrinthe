const BASE_URL = "https://hire-game-maze.pertimm.dev/";

let discoveryUrl = "";
let moveUrl = "";

// let discoveredElements  = [];

// let pathToMove = { positionX: null, positionY: null };
let availableMoves = [];

let visited = [];
// let actualPosition = { positionX: null, positionY: null };

async function startGame() {
  console.log("C'est parti");
  try {
    const response = await fetch(`${BASE_URL}start-game/`, {
      method: "POST",
      headers: {
        // "Content-type": "application/json"
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // body: JSON.stringify({ player: "chacha" }),
      body: "player=chacha",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    return {
      discoverURL: data.url_discover,
      moveURL: data.url_move,
      actualPosition: {
        x: data.position_x,
        y: data.position_y,
      },
    };
  } catch (error) {
    console.error("Erreur dans startGame :", error);
    throw error;
  }
}

async function discover(discoverURL) {
  try {
    const response = await fetch(discoverURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response}`);
    }
    let discoveredElements = [];
    data.forEach((element) => {
      discoveredElements.push(element);
    });
    console.log("chemins découverts", discoveredElements);
    return discoveredElements;
  } catch (error) {
    console.error("Erreur dans discover :", error);
    throw error;
  }
}

async function move(moveURL, positionSent) {
  console.log("Coordonnées envoyées :", positionSent);

  try {
    const response = await fetch(moveURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `position_x=${positionSent.x}&position_y=${positionSent.y}`,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response}`);
    }

    return data;
  } catch (error) {
    console.error("Erreur dans move :", error);
    throw error;
  }
}

async function actionDiscMove(discoverURL, moveURL) {
  // 1- On récupère les 4 chemins proposés via discover
  const discoveredElements = await discover(discoverURL);
  // 2- On filtre les 4 chemins proposés pour ne garder que les "move = true" et on les stocke dans un tableau
  const availableMoves = discoveredElements.filter(
    (element) => element.move === true
  );

  // 3-Savoir combien de fois chaque chemin a été visité
  availableMoves.forEach((move) => {
    const key = `${move.x}${move.y}`;
    const count = visited[key] || 0;
    console.log(`Case (${key}) visitée ${count} fois`);
  });

  // 4 - Choisir le move avec le plus petit compteur

  // 5 - move() vers cette case
  await move(moveURL, positionToSend);

  // 6 - Incrémenter le compteur pour la nouvelle case
}

async function main() {
  const { discoverURL, moveURL, actualPosition } = await startGame();
  await actionDiscMove(discoverURL, moveURL, actualPosition);
}
await main();

// const positionToSend = {
//   x: availableMoves[0].x,
//   y: availableMoves[0].y,
//
