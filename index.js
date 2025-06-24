const BASE_URL = "https://hire-game-maze.pertimm.dev/";

async function startGame() {
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
        positionX: data.position_x,
        positionY: data.position_y,
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
    return discoveredElements;
  } catch (error) {
    console.error("Erreur dans discover :", error);
    throw error;
  }
}

async function move(moveURL, location) {
  try {
    const response = await fetch(moveURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `position_x=${location.x}&position_y=${location.y}`,
    });

    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Erreur dans move :", error);
    throw error;
  }
}

async function main() {
  const { discoverURL, moveURL } = await startGame();

  //@TODO: créer boucle automatique pour sortir du labyrinthe
  const discoveredElements = await discover(discoverURL);
  //@TODO: que faire si plusieurs safePath ?
  //@TODO: que faire si on est bloqué dans un cul de sac ? (enregistrer toutes les cases traversées + chemin qui vient juste d'être emprunté ?=> lastPosition ?)
  const safePath = discoveredElements.find((element) => element.move === true);
  const location = {
    x: safePath.x,
    y: safePath.y,
  };
  const destination = await move(moveURL, location);

  console.log("discoveredElements", discoveredElements);
  console.log("safePath", safePath);
  console.log("location", location);
  console.log("destination", destination);
}

await main();

// implémenter une fonction récursive pour discover/move jusqu'à Win ou Death

function recurs(param) {
  console.log("param", param);
  param++;
  if (param > 10) return;
  recurs(param);
}

recurs(0);
