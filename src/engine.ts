import {gravitationalConstant, playerSize} from "./config";

export abstract class Entity {
  protected posX: number = 0;
  protected posY: number = 0;

  abstract draw(ctx: CanvasRenderingContext2D): void;
}

export abstract class MutableEntity extends Entity {
  abstract nextState(): void;
}

export abstract class MovableEntity extends MutableEntity {
  protected velX: number = 0;
  protected velY: number = 0;

  protected accX: number = 0;
  protected accY: number = 0;

  nextState(): void {
    this.posX += this.velX;
    this.posY += this.velY;
    this.velX += this.accX;
    this.velY += this.accY;
  }
}

export class Player extends MovableEntity {
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, playerSize, 0, 2 * Math.PI);
    ctx.stroke();
  }

  constructor(protected posX: number, protected posY: number) {
    super();
    this.accY = gravitationalConstant;
  }
}
