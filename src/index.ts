import {performCollision, GroupedEntityList} from "./engine";
import {DRAW_BOUNDING_RECT, TICK_INTERVAL} from "./config";

export class CanvasAnimation {
  private readonly ctx: CanvasRenderingContext2D;
  private entityList: GroupedEntityList = new GroupedEntityList();

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d')!!;

    window.setInterval(() => this.tick(), TICK_INTERVAL);
    window.requestAnimationFrame(() => this.draw());
  }

  tick() {
    for (let i = 0; i < this.entityList.mutableEntityCount(); i++) {
      this.entityList.mutableEntity(i).incrementState();
    }

    // Check for and perform collisions
    for (let i = 0; i < this.entityList.movableEntityCount(); i++) {
      for (let j = 1; j < this.entityList.entityCount(); j++) {
        let movableEntity = this.entityList.movableEntity(i);
        let otherEntity = this.entityList.entity(j);
        if (movableEntity.collidingWidth(otherEntity)) {
          performCollision(movableEntity, otherEntity)
        }
      }
    }
  }

  draw() {
    this.drawBg();
    for (let i = 0; i < this.entityList.entityCount(); i++) {
      this.entityList.entity(i).draw(this.ctx);
    }
    if (DRAW_BOUNDING_RECT) {
      for (let i = 0; i < this.entityList.entityCount(); i++) {
        let bRect = this.entityList.entity(i).boundingRect();
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.strokeRect(bRect.x1, bRect.y1, bRect.x2 - bRect.x1, bRect.y2 - bRect.y1);
      }
    }
    window.requestAnimationFrame(() => this.draw());
  }

  drawBg() {
    this.ctx.fillStyle = "#eeeeee";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

const canvas = <HTMLCanvasElement>document.getElementById('game-canvas');
new CanvasAnimation(canvas);
