import {Entity, MovableEntity, Player} from "./engine";

export class CanvasAnimation {
  private readonly ctx: CanvasRenderingContext2D;
  private movableEntities: MovableEntity[] = [];
  private entities: Entity[] = [];

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d')!!;

    let player1: Player = new Player(100, 100);
    let player2: Player = new Player(200, 100);

    this.movableEntities.push(player1);
    this.movableEntities.push(player2);

    this.entities.push(player1);
    this.entities.push(player2);

    window.setInterval(() => this.tick(), 16);
    window.requestAnimationFrame(() => this.draw());
  }

  tick() {
    console.log(this.movableEntities.length);
    this.movableEntities.forEach( entity => {
      entity.nextState();
      console.log(entity);
    });
  }

  draw() {
    this.drawBg();
    this.entities.forEach( entity => {
      entity.draw(this.ctx);
    });
    window.requestAnimationFrame(() => this.draw());
  }

  drawBg() {
    this.ctx.fillStyle = "#eeeeee";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

const canvas = <HTMLCanvasElement>document.getElementById('game-canvas');
new CanvasAnimation(canvas);
