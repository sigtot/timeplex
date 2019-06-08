import {Entity, MovableEntity} from "./engine";

export class Box extends Entity {
  constructor(public posX: number, public posY: number, public width: number, public height: number) {
    super();
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#444444";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}

export class Platform extends MovableEntity {
  private stateCounter: number = 0;
  constructor(public posX: number, public posY: number, public velX: number, public velY: number, public width: number,
              public height: number, private moveIval: number) {
    super();
    this.unstoppable = true;
  }
  incrementState(): void {
    super.incrementState();
    if (this.stateCounter == this.moveIval) {
      this.stateCounter = 0;
      this.velY *= -1;
      this.velX *= -1;
    }
    this.stateCounter++;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#444444";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}

export class FloatingBouncyWall extends Entity {
  constructor(public posX: number, public posY: number, public width: number, public height: number) {
    super();
    this.bouncy = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#44cc44";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}
