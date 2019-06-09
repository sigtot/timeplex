import {Entity} from "./engine";
import {Box, FloatingBouncyWall} from "./baseentities";
import {Player} from "./player";

export abstract class Level {
  abstract getEntities(): Entity[];
  abstract begin(): void;
  private levelTick: number = 0;
  protected abstract player: Player;
  tick() {
    this.levelTick++;
    this.player.tick();
  }
  resetTicker() {
    this.levelTick = 0;
  }
}

export class Level1 extends Level {
  protected player: Player;
  private entities: Entity[] = [];
  getEntities(): Entity[] {
    return this.entities;
  }

  begin(): void {
    this.player.grabKeyboard();
  }
  constructor() {
    super();
    this.player = new Player(260, 380);
    this.entities.push(this.player);

    this.entities.push(new Box(0, 190, 600, 40));
    this.entities.push(new Box(140, 330, 460, 40));
    this.entities.push(new Box(140, 460, 560, 40));
    this.entities.push(new FloatingBouncyWall(0, 230, 40, 270));
    this.entities.push(new FloatingBouncyWall(560, 230, 40, 100));

    this.entities.push(new Box(0, 600, 700, 40));
    this.entities.push(new Box(1000, 600, 200, 40));
  }
}
