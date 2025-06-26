const BASE_URL = "https://hire-game-maze.pertimm.dev/";
const playerName = "";

let discoveryUrl = "";
let moveUrl = "";

// let pathsDiscovered = [];

// let pathToMove = { positionX: null, positionY: null };
let listPathMoveTrue = [];

let pathVisited = [];
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
    let pathsDiscovered = [];
    data.forEach((element) => {
      pathsDiscovered.push(element);
    });
    console.log("chemins découverts", pathsDiscovered);
    return pathsDiscovered;
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

async function actionDiscMove(discoverURL, moveURL, actualPosition) {
  const pathsDiscovered = await discover(discoverURL);
  // let listPathMoveTrue = [];
  // const safePath = pathsDiscovered.find((element) => element.move === true);
  // listPathMoveTrue.push(safePath);
  const listPathMoveTrue = pathsDiscovered.filter(
    (element) => element.move === true
  );

  console.log("PATHS TO MOVE", listPathMoveTrue);

  //@TODO : check tous les paths et faire les conditions avant de move
  const positionToSend = {
    x: listPathMoveTrue[0].x,
    y: listPathMoveTrue[0].y,
  };

  pathVisited.push(positionToSend);
  const destination = await move(moveURL, positionToSend);
  console.log("pathVisited", pathVisited);
  // actualPosition.positionX = destination.position_x;
  // actualPosition.positionY = destination.position_y;

  // console.log("pathsDiscovered", pathsDiscovered);
  console.log("listPathMoveTrue", listPathMoveTrue);
  console.log("destination", destination);

  // console.log("safePath", safePath);

  /* ===========> SI 1 SEUL CHEMIN <=========== */ /*<=== N'existe que lors de start game et cul-de-sac */
  if (listPathMoveTrue.length === 1) {
    console.log("1 chemin");
    await actionDiscMove(discoverURL, moveURL, actualPosition);
  }
  /* ===========> SI 2 CHEMINS <=========== */ /*<=== Couloir tout droit où l'une des 2 cases est celle doù on vient */
  if (listPathMoveTrue.length === 2) {
    console.log("2 chemin");
    console.log(listPathMoveTrue);
    return;
    // On boucle sur un tableau des cases visitées préalablement stockées :
    //  si un des deux chemins visitables ne s'y trouve pas, on l'enregistre comme destination et le push dans le tableau des cases visitées
  } else if (listPathMoveTrue.length > 2) {
    // On calcule le chemin à gauche de actualPosition et on move dessus
    console.log("3 chemins");
    console.log(listPathMoveTrue);
    return;
  } else {
    console.log("je sais pas");
    return;
  }
}

async function main() {
  const { discoverURL, moveURL, actualPosition } = await startGame(); // =====> DEBUT DU JEU
  pathVisited.push(actualPosition);

  // ========> Si le jeu a démarré
  if (discoverURL != "") {
    // ====> on lance actionDiscMove(discoverURL, moveURL);
    // console.log("discoverURL", discoverURL);
    await actionDiscMove(discoverURL, moveURL, actualPosition);
  } else {
    console.log("oups");
    console.log(error);
    return;
  }
  return;
}
await main();
