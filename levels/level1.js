const backgroundArray = [];

for (let i = -1; i <= 5; i++) {
  let x;
  if (i % 2 === 0) {
    x = 1
  } else {
    x = 2
  }
  backgroundArray.push(
    new BackgroundObject(`./img/3. Background/Layers/5. Water/L${x}.png`, i * 720),
    new BackgroundObject(`./img/3. Background/Layers/4.Fondo 2/L${x}.png`, i * 720),
    new BackgroundObject(`./img/3. Background/Layers/3.Fondo 1/L${x}.png`, i * 720),
    new BackgroundObject(`./img/3. Background/Layers/2. Floor/L${x}.png`, i * 720),
    new BackgroundObject(`./img/3. Background/Layers/1. Light/${x}.png`, i * 720)
  );
}

const collectiblesArray = [
  new Coin(820, 40), new Coin(860, 80), new Coin(920, 100), new Coin(980, 80), new Coin(1020, 40),
  new Coin(1820, 420), new Coin(1860, 380), new Coin(1920, 360), new Coin(1980, 380), new Coin(2020, 420),
  new Coin(2620, 40), new Coin(2660, 80), new Coin(2720, 100), new Coin(2780, 80), new Coin(2820, 40),

  new Coin(500, 250), new Coin(570, 170), new Coin(570, 330), new Coin(640, 250), new Poison(555, 230,),
  new Coin(1400, 150), new Coin(1470, 70), new Coin(1470, 230), new Coin(1540, 150), new Poison(1455, 130,),
  new Coin(2900, 330), new Coin(2970, 250), new Coin(2970, 410), new Coin(3040, 330), new Poison(2955, 310,),

  new Poison(1000, 320, "left"),
  new Poison(2150, 330, "right"),
  new Poison(2450, 350, "left"),

]



const level1 = new Level(
  [
    new GreenFish(700, 80, "normal"),
    new GreenFish(780, 40, "normal"),
    new GreenFish(780, 120, "normal"),
    new GreenFish(1200, 360, "normal"),
    new GreenFish(1280, 400, "normal"),
    new GreenFish(1280, 320, "normal"),
    new GreenFish(1580, 200, "big"),
    new GreenFish(1660, 250, "normal"),
    new GreenFish(1660, 170, "normal"),
    new GreenFish(1740, 290, "normal"),
    new GreenFish(1740, 130, "normal"),

    new JellyFishYellow(2200, 200),
    new JellyFishYellow(2280, 160),
    new JellyFishYellow(2360, 120),
    new JellyFishYellow(2850, 370),
    new JellyFishYellow(2930, 330),
    new JellyFishYellow(3010, 290),

    new JellyFishGreen(1900, 100, -1),
    new JellyFishGreen(2000, 180, 1),
    new JellyFishGreen(2100, 140, -1),
    new JellyFishGreen(2200, 280, 1),
    new JellyFishGreen(2300, 260, -1),
    new JellyFishGreen(2400, 120, 1),
    new JellyFishGreen(2500, 300, -1),

    new RedFish(),

    new Endboss(),
  ],
  [...backgroundArray],
  [...collectiblesArray],
  [new PosionBar(), new HpBar(), new CoinBar(), new HpBarEndboss()],

);


function resetLevel() {


  return new Level(
    [
      new GreenFish(700, 80, "normal"),
      new GreenFish(780, 40, "normal"),
      new GreenFish(780, 120, "normal"),
      new GreenFish(1200, 360, "normal"),
      new GreenFish(1280, 400, "normal"),
      new GreenFish(1280, 320, "normal"),
      new GreenFish(1580, 200, "big"),
      new GreenFish(1660, 250, "normal"),
      new GreenFish(1660, 170, "normal"),
      new GreenFish(1740, 290, "normal"),
      new GreenFish(1740, 130, "normal"),

      new JellyFishYellow(2200, 200),
      new JellyFishYellow(2280, 160),
      new JellyFishYellow(2360, 120),
      new JellyFishYellow(2850, 370),
      new JellyFishYellow(2930, 330),
      new JellyFishYellow(3010, 290),

      new JellyFishGreen(1900, 100, -1),
      new JellyFishGreen(2000, 180, 1),
      new JellyFishGreen(2100, 140, -1),
      new JellyFishGreen(2200, 280, 1),
      new JellyFishGreen(2300, 260, -1),
      new JellyFishGreen(2400, 120, 1),
      new JellyFishGreen(2500, 300, -1),

      new RedFish(),

      new Endboss(),
    ],
    [...backgroundArray],
    [...collectiblesArray],
    [new PosionBar(), new HpBar(), new CoinBar(), new HpBarEndboss()],

  );
}

