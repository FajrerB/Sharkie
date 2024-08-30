class Level {
  enemies;
  backgroundObjects;
  collectibles;
  statusbars;
  level_end_x = 3600;

  constructor(enemies, backgroundObjects, collectibles, statusbars) {
    this.enemies = enemies;
    this.backgroundObjects = backgroundObjects;
    this.collectibles = collectibles;
    this.statusbars = statusbars;
  }
}
