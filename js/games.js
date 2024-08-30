let canvas;
let world;
let keyboard = new Keyboard();
let menu = false;
let pause = false;
let gameStarted = false;
let fullscreen = false;

let audioElements = {
  swimming_sound: new Audio("./audio/swimming.mp3"),
  poisoned_sound: new Audio("./audio/poisoned.mp3"),
  shock_sound: new Audio("./audio/shock.mp3"),
  melee_sound: new Audio("./audio/melee_attack.mp3"),
  idle_sound: new Audio("./audio/long_idle.mp3"),
  item_pickup_sound: new Audio("./audio/item_pickup.mp3"),
  coin_sound: new Audio("./audio/coin_sound.mp3"),
  level_up_sound: new Audio("./audio/level_up.mp3"),
  bubble_sound: new Audio("./audio/bubble.mp3"),
  endboss_hit_sound: new Audio("./audio/endboss_hit.mp3"),
  endboss_attack_sound: new Audio("./audio/endboss_attack.mp3"),
  endboss_dead_sound: new Audio("./audio/endboss_dead.mp3"),
  bossfight_sound: new Audio("./audio/bossfight_sound.mp3"),
  background_sound: new Audio("./audio/background_sound.mp3"),
  fish_hit_sound: new Audio("./audio/fish_hit.mp3"),
  jellyfish_hit_sound: new Audio("./audio/jellifish_hit.mp3"),
  background_sound: new Audio("./audio/background_sound.mp3"),
  game_over_sound: new Audio("./audio/game_over.mp3"),
};

/**
 * Initializes the game by setting up the canvas, world, sounds, pause state, and button press events.
 */

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  loadeSounds();
  togglePause();
  document.getElementById("pause").classList.add("d-none");
  bindBtsPressEvents();
}

/**
 * Listens for keydown events on the window and updates keyboard state accordingly.
 */
window.addEventListener("keydown", (event) => {
  if (event.keyCode == 38) {
    keyboard.UP = true;
  }
  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 68) {
    keyboard.D = true;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
});


/**
 * Listens for keyup events on the window and updates keyboard state accordingly.
 */
window.addEventListener("keyup", (event) => {
  if (event.keyCode == 38) {
    keyboard.UP = false;
  }
  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 68) {
    keyboard.D = false;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
});


/**
 * Binds touch events to button elements for mobile control.
 */
function bindBtsPressEvents() {
  const buttons = [
    "moveUp",
    "moveRight",
    "moveDown",
    "moveLeft",
    "meleeAttack",
    "rangeAttack",
  ];

  buttons.forEach((id) => {
    const element = document.getElementById(id);

    element.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[
        id === "moveUp"
          ? "UP"
          : id === "moveRight"
          ? "RIGHT"
          : id === "moveDown"
          ? "DOWN"
          : id === "moveLeft"
          ? "LEFT"
          : id === "meleeAttack"
          ? "SPACE"
          : "D"
      ] = true;
      if (!element.classList.contains("fullscreen")) {
        element.classList.add("activeMobileButton");
      }
    });

    element.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[
        id === "moveUp"
          ? "UP"
          : id === "moveRight"
          ? "RIGHT"
          : id === "moveDown"
          ? "DOWN"
          : id === "moveLeft"
          ? "LEFT"
          : id === "meleeAttack"
          ? "SPACE"
          : "D"
      ] = false;
      if (!element.classList.contains("fullscreen")) {
        element.classList.remove("activeMobileButton");
      }
    });
  });
}

/**
 * Loads audio elements into the world object.
 * */
function loadeSounds() {
  Object.entries(audioElements).forEach(([key, audio]) => {
    world[key] = audio;
  });
}

/**
 * switches the sound on or off by setting the audio file volume to 0 or 1
 */
function toggleSound() {
  if (world.sound) {
    world.sound = false;
    Object.values(audioElements).forEach((audio) => {
      audio.volume = 0;
    });
    document.getElementById("sound").classList.add("d-none");
    document.getElementById("noSound").classList.remove("d-none");
  } else {
    world.sound = true;
    Object.values(audioElements).forEach((audio) => {
      audio.volume = 1;
    });
    document.getElementById("sound").classList.remove("d-none");
    document.getElementById("noSound").classList.add("d-none");
  }
}
/**
 * starts the game
 */
function startGame() {
  world.character.lastMove = new Date().getTime();
  document.getElementById("startScreen").classList.add("d-none");
  togglePause();
  gameStarted = true;
  world.background_sound.play();

  forceLandscapeOnMobile();
  handleUserDevice();
}
/**
 * shows and hides the menu, while the menu is shown the game is paused,
 * the current paused state is saved before the menu is opened
 * so that it can be recalled when the menu is closed
 */
function toggleMenu() {
  let alreadyPaused = pause;
  if (menu) {
    hideMenu();
    menu = false;
    if (!alreadyPaused && !world.gameOver) {
      pause = true;
      togglePause();
    } else if (gameStarted && !world.gameOver) {
      document.getElementById("pause").classList.remove("d-none");
    }
  } else {
    showMenu();
    menu = true;
    if (!alreadyPaused && !world.gameOver) {
      togglePause();
      pause = false;
    }
    document.getElementById("pause").classList.add("d-none");
  }
}

/**
 * hides the overlay menu to the user
 */
function hideMenu() {
  document.getElementById("openMenu").classList.remove("d-none");
  document.getElementById("closeMenu").classList.add("d-none");
  document.getElementById("gameInfos").classList.add("d-none");
}

/**
 * shows the overlay menu to the user
 */
function showMenu() {
  document.getElementById("openMenu").classList.add("d-none");
  document.getElementById("closeMenu").classList.remove("d-none");
  document.getElementById("gameInfos").classList.remove("d-none");
}

/**
 * shows the selected section and hides the other ones
 * @param {string} section - selected section
 */
function openInfoSection(section) {
  document.getElementById("controlsContent").classList.add("d-none");
  document.getElementById("tipsContent").classList.add("d-none");
  document.getElementById("sourcesContent").classList.add("d-none");
  document.getElementById("controls").classList.remove("activeSection");
  document.getElementById("tips").classList.remove("activeSection");
  document.getElementById("sources").classList.remove("activeSection");
  document.getElementById(section + "Content").classList.remove("d-none");
  document.getElementById(section).classList.add("activeSection");
}

/**
 * pauses the game
 */
function togglePause() {
  if (pause) {
    document.getElementById("noPause").classList.remove("d-none");
    document.getElementById("pause").classList.add("d-none");
    world.resumeAllIntervals();
    pause = false;
  } else {
    world.background_sound.pause();
    world.idle_sound.pause();
    world.bossfight_sound.pause();
    document.getElementById("noPause").classList.add("d-none");
    document.getElementById("pause").classList.remove("d-none");
    world.clearAllIntervals();
    pause = true;
  }
}

/**
 * switches back and forth between fullscreen and normal view
 * depending on which state is current
 */
function toggleFullscreen() {
  let mainContainer = document.getElementById("mainContainer");
  if (!fullscreen) {
    fullscreen = true;
    document.getElementById("noFullscreen").classList.remove("d-none");
    document.getElementById("fullscreen").classList.add("d-none");
    enterFullscreen(mainContainer);
  } else {
    fullscreen = false;
    exitFullscreen(mainContainer);
    document.getElementById("noFullscreen").classList.add("d-none");
    document.getElementById("fullscreen").classList.remove("d-none");
  }
}

/**
 * Requests fullscreen mode for the given element and adds the 'fullscreen' class to various elements.
 * @param {HTMLElement} element - The HTML element to enter fullscreen mode.
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
  element.classList.add("fullscreen");
  document.getElementById("canvas").classList.add("fullscreen");
  document.getElementById("startScreenBg").classList.add("fullscreen");
  document.getElementById("gameoverScreenBg").classList.add("fullscreen");
  document.getElementById("endScreenBg").classList.add("fullscreen");
  document.getElementById("gameInfos").classList.add("fullscreen");
}

/**
 * Exits fullscreen mode and removes the 'fullscreen' class from various elements.
 * @param {HTMLElement} element - The HTML element to exit fullscreen mode.
 */
function exitFullscreen(element) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  element.classList.remove("fullscreen");
  document.getElementById("canvas").classList.remove("fullscreen");
  document.getElementById("startScreenBg").classList.remove("fullscreen");
  document.getElementById("gameoverScreenBg").classList.remove("fullscreen");
  document.getElementById("endScreenBg").classList.remove("fullscreen");
  document.getElementById("gameInfos").classList.remove("fullscreen");
}

/**
 * Restarts the game by toggling sound and pause, resetting the level and character,
 * reloading sounds, clearing all intervals, and hiding the end screen.
 */
function restartGame() {
  toggleSound();
  togglePause();
  world.level = resetLevel();
  world.resetCharacter();
  world.gameOver = false;
  loadeSounds();
  world.setWorld();
  world.clearAllIntervals();
  togglePause();
  toggleSound();
  hideEndscreen();
}

/**
 * Hides the end screen elements after a short delay.
 */
function hideEndscreen() {
  setTimeout(() => {
    document.getElementById("endScreen").classList.add("d-none");
    document.getElementById("gameover").classList.add("d-none");
    document.getElementById("noPause").classList.remove("d-none");

    document.getElementById("restartButtonGameover").classList.add("d-none");
    document
      .getElementById("restartButtonGameover")
      .classList.remove("visible");

    document.getElementById("restartButtonEndscreen").classList.add("d-none");
    document
      .getElementById("restartButtonEndscreen")
      .classList.remove("visible");
  }, 150);
}

/**
 * Checks the screen orientation and adjusts the canvas height accordingly.
 * If in landscape mode and the height is less than 480px, sets the canvas height to the window height.
 * If in portrait mode, sets the canvas height to 100%.
 */
function checkOrientation() {
  if (window.matchMedia("(orientation: landscape)").matches) {
    if (window.innerHeight < 480) {
      let newHeight = window.innerHeight;
      document.getElementById("canvas").style.height = `${newHeight}px`;
    }
  } else {
    document.getElementById("canvas").style.height = `100%`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleUserDevice();
  window.addEventListener("resize", handleUserDevice);
  forceLandscapeOnMobile();
  checkOrientation();
});

/**
 * checks, if the device is a tablet
 * @returns {boolean} - true, if it is one
 */
function tabletCheck() {
  const tabletAgents = /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i;
  return tabletAgents.test(navigator.userAgent);
}

/**
 *
 * @returns boolean, whether it is a mobile device
 */
window.mobileCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};


/**
 * shows a request to use the mobile device in landscape mode if this is not already the case
 */
function forceLandscapeOnMobile() {
  let isMobileOrTablet = window.matchMedia("(max-width: 1366px)").matches;
  let isLandscape = window.matchMedia("(orientation: landscape)").matches;

  if (isMobileOrTablet && !isLandscape) {
    document.getElementById("forceLandscapeMobile").classList.remove("d-none");
  } else {
    document.getElementById("forceLandscapeMobile").classList.add("d-none");
  }
}

/**
 * if a mobile device is used, the buttons for the mobile version should be displayed
 */
function handleUserDevice() {
  const isMobile = window.mobileCheck();
  const isTablet = window.matchMedia("(max-width: 1366px)").matches;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  if ((isMobile || isTablet) && isLandscape) {
    document.getElementById("movementMobile").classList.remove("d-none");
    document.getElementById("attackMobile").classList.remove("d-none");
    document.getElementById("fullscreen").classList.add("d-none");
    document.getElementById("forceLandscapeMobile").classList.add("d-none"); 
  } else {
    document.getElementById("movementMobile").classList.add("d-none");
    document.getElementById("attackMobile").classList.add("d-none");
    if (!fullscreen) {
      document.getElementById("fullscreen").classList.remove("d-none");
    }
    if (isMobile || isTablet) {
      document.getElementById("forceLandscapeMobile").classList.remove("d-none"); 
    }
  }
}
window.addEventListener('load', () => {
  handleUserDevice(); 
});


