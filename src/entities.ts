import {Entity, MovableEntity, MutableEntity} from "./engine";
import {GRAVITATIONAL_CONSTANT, PLAYER_MASS, PLAYER_SIZE} from "./config";

export class MagicBox extends MutableEntity {
  private stateCounter: number = 0;
  private growSign: number = 1;

  constructor(public posX: number, public posY: number, public width: number, public height: number,
              private growShrinkIval: number, private growAmount: number) {
    super();
  }
  incrementState(): void {
    if (this.stateCounter == this.growShrinkIval) {
      this.stateCounter = 0;
      this.growSign *= -1;
    }
    this.stateCounter++;
    this.height += this.growSign * this.growAmount;
    this.posY -= this.growSign * this.growAmount;
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#333333";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}

export class Box extends Entity {
  constructor(public posX: number, public posY: number, public width: number, public height: number) {
    super();
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#444444";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}

export class Player extends MovableEntity {
  public accY: number = GRAVITATIONAL_CONSTANT;

  constructor(public posX: number, public posY: number) {
    super();
    this.height = PLAYER_SIZE;
    this.width = PLAYER_SIZE;
    this.mass = PLAYER_MASS;
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#333333";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}
