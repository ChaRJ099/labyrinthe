const BASE_URL = "https://hire-game-maze.pertimm.dev/";

let discoveryUrl = "";
let moveUrl = "";

// let discoveredElements  = [];

// let pathToMove = { positionX: null, positionY: null };
let availableMoves = [];

let visited = {};
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
  let availableMoves = discoveredElements.filter(
    (element) => element.move === true
  );

  console.log("available", availableMoves);

  // 3-Savoir combien de fois chaque chemin a été visité

  // if (availableMoves.length === 1) {

  if (availableMoves.length > 1) {
    console.log("visited", visited);
    availableMoves = availableMoves.filter((move, index) => {
      console.log("move", `${move.x}${move.y}`);
      return visited[`${move.x}${move.y}`] === undefined;
    });
  }

  // On avance sur le seul ou le premier path dispo
  const positionSent = {
    x: availableMoves[0].x,
    y: availableMoves[0].y,
  };
  const dataMove = await move(moveURL, positionSent);

  if (availableMoves[0].value === "stop") {
    console.log("WIN", dataMove);
    return;
  }

  const key = [`${dataMove.position_x}${dataMove.position_y}`];
  visited[key] = visited[key] ? (visited[key] += 1) : 1;
  await actionDiscMove(dataMove.url_discover, dataMove.url_move, positionSent);
}

async function main() {
  const { discoverURL, moveURL, actualPosition } = await startGame();
  visited[`${actualPosition.x}${actualPosition.y}`] = 1;
  await actionDiscMove(discoverURL, moveURL, actualPosition);
}
await main();
