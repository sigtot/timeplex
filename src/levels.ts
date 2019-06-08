import {Entity} from "./engine";
import {Box, FloatingBouncyWall, Platform} from "./baseentities";
import {Player} from "./player";

export abstract class Level {
  abstract entities(): Entity[];
  abstract begin(): void;
  private levelTick: number = 0;
  tick() {
    this.levelTick++;
  }
  resetTicker() {
    this.levelTick = 0;
  }
}

export class Level1 extends Level {
  player: Player = new Player(260, 100);
  entities(): Entity[] {
    let entities: Entity[] = [];
    entities.push(new Box(0, 300, 700, 500));
    entities.push(new Box(200, 180, 300, 40));
    entities.push(this.player);
    entities.push(new Platform(800, 300, 0, -0.3, 300, 40, 200));
    entities.push(new FloatingBouncyWall(1150, 60, 40, 200));
    entities.push(new FloatingBouncyWall(50, 60, 40, 200));
    entities.push(new FloatingBouncyWall(750, 500, 400, 40));
    return entities;
  }

  begin(): void {
    this.player.grabKeyboard();
  }
}
