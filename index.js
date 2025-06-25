const BASE_URL = "https://hire-game-maze.pertimm.dev/";

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
  console.log("Coordonnées envoyées :", location);

  console.log("Appel moveURL :", moveURL);
  try {
    const response = await fetch(moveURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `position_x=${location.x}&position_y=${location.y}`,
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
  const discoveredElements = await discover(discoverURL);
  //@TODO: que faire si on est bloqué dans un cul de sac ? (enregistrer toutes les cases traversées + chemin qui vient juste d'être emprunté ?=> lastPosition ?)
  //@TODO: ou alors, choisir toujours gauche ou toujours droite comme chemin à suivre sauf si demi-tour ou tout droit ou 1 seul path possible,
  //       preferer le tout droit plutot que la position opposée de celle par défaut
  // let safePathList = [];
  // const safePath = discoveredElements.find((element) => element.move === true);
  // safePathList.push(safePath);
  const safePathList = discoveredElements.filter(
    (element) => element.move === true
  );

  const location = {
    x: safePathList[0].x,
    y: safePathList[0].y,
  };
  console.log("Position actuelle avant move :", actualPosition);
  const destination = await move(moveURL, location);
  actualPosition.positionX = destination.position_x;
  actualPosition.positionY = destination.position_y;

  console.log("Position cible envoyée à move :", location);
  console.log("Position retournée après move :", {
    x: destination.position_x,
    y: destination.position_y,
  });

  // console.log("discoveredElements", discoveredElements);
  console.log("safePathList", safePathList);
  // console.log("location", location);
  console.log("destination", destination);

  // console.log("safePath", safePath);
  if (safePathList.length === 0) {
    console.log("Aucun chemin possible : fin du jeu ou cul-de-sac.");
    return;
  } else if (safePathList.length === 1) {
    console.log("1 chemin : on relance actionDiscMove");
    await actionDiscMove(discoverURL, moveURL, actualPosition);
  } else if (safePathList.length > 1) {
    // On calcule le chemin à gauche de actualPosition et on move dessus
    console.log(
      "Plusieurs chemins : on relance actionDiscMove sur le chemin de gauche"
    );
    console.log(safePathList);
    // actionDiscMove(discoverURL, moveURL);
  } else {
    console.log("je sais pas");
    return;
  }
  return;
}

async function main() {
  const { discoverURL, moveURL, actualPosition } = await startGame(); // =====> DEBUT DU JEU

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
