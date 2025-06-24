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

async function move() {
  try {
    const response = await fetch(discoverURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response}`);
    }

    return; //
  } catch (error) {
    console.error("Erreur dans move :", error);
    throw error;
  }
}

async function main() {
  const { discoverURL, moveURL, actualPosition } = await startGame();
  const discoveredElements = await discover(discoverURL);

  console.log("actualPosition", actualPosition);
  console.log("discoveredElements", discoveredElements);

  // usefull if throw error else erase try catch
}

main();
