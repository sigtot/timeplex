import {COLLISION_THRESH} from "./config";

class Rectangle {
  constructor(public x1: number, public x2: number, public y1: number, public y2: number) {};
}

export abstract class Entity {
  posX: number = 0;
  posY: number = 0;
  velX: number = 0;
  velY: number = 0;
  accX: number = 0;
  accY: number = 0;

  height: number = 0;
  width: number = 0;

  bouncy: boolean = false;

  abstract draw(ctx: CanvasRenderingContext2D): void;
  boundingRect(): Rectangle {
    return new Rectangle(this.posX, this.posX + this.width, this.posY, this.posY + this.height)
  };

  collidingWidth(subject: Entity): boolean {
    let rect1 = this.boundingRect();
    let rect2 = subject.boundingRect();
    return (rect1.x1 <= rect2.x2 && rect1.x2 >= rect2.x1 && rect1.y1 <= rect2.y2 && rect1.y2 >= rect2.y1);
  }

  collidingFromBottomWith(subject: Entity): boolean {
    return subject.boundingRect().y2 - this.boundingRect().y1 < COLLISION_THRESH;
  }

  collidingFromTopWith(subject: Entity): boolean {
    return this.boundingRect().y2 - subject.boundingRect().y1 < COLLISION_THRESH;
  }

  collidingFromRightWith(subject: Entity): boolean {
    return subject.boundingRect().x2 - this.boundingRect().x1 < COLLISION_THRESH;
  }

  collidingFromLeftWith(subject: Entity): boolean {
    return this.boundingRect().x2 - subject.boundingRect().x1 < COLLISION_THRESH;
  }

  hitFromBelow () {}
  hitFromTop () {}
  hitFromLeft () {}
  hitFromRight () {}
  resetContactSurfaces () {}
}

export abstract class MutableEntity extends Entity {
  inContactFromBelow: boolean = false;
  inContactFromTop: boolean = false;
  inContactFromLeft: boolean = false;
  inContactFromRight: boolean = false;

  abstract incrementState(): void;
  hitFromBelow() {
    this.inContactFromBelow = true;
  }
  hitFromTop() {
    this.inContactFromTop = true;
  }
  hitFromLeft() {
    this.inContactFromLeft = true;
  }
  hitFromRight() {
    this.inContactFromRight = true;
  }
  resetContactSurfaces() {
    this.inContactFromBelow = false;
    this.inContactFromTop = false;
    this.inContactFromLeft = false;
    this.inContactFromRight = false;
  }
}

export abstract class MovableEntity extends MutableEntity {

  public mass: number = 1;

  public unstoppable: boolean = false;

  incrementState(): void {
    this.velX += this.accX;
    this.velY += this.accY;
    this.posX += this.velX;
    this.posY += this.velY;
  }
}


export class GroupedEntityList {
  private movableEntities: MovableEntity[] = [];
  private otherMutableEntities: MutableEntity[] = [];
  private otherEntities: Entity[] = [];

  addEntity(entity: Entity): void {
    if (entity instanceof MovableEntity) {
      this.movableEntities.push(entity);
    } else if (entity instanceof  MutableEntity) {
      this.otherMutableEntities.push(entity);
    } else {
      this.otherEntities.push(entity);
    }
  }

  movableEntityCount(): number {
    return this.movableEntities.length;
  }

  mutableEntityCount(): number {
    return this.movableEntityCount() + this.otherMutableEntities.length;
  }

  entityCount(): number {
    return this.mutableEntityCount() + this.otherEntities.length;
  }

  movableEntity(id: number): MovableEntity {
    if (id < 0 || id >= this.movableEntityCount()) {
      throw "No MovableEntity with that id";
    }
    return this.movableEntities[id];
  }

  mutableEntity(id: number): MutableEntity {
    if (id < 0 || id >= this.mutableEntityCount()) {
      throw "No MutableEntity with that id";
    }
    if (id < this.movableEntityCount()) {
      return this.movableEntity(id);
    } else {
      return this.otherMutableEntities[id - this.movableEntityCount()];
    }
  }

  entity(id: number): Entity {
    if (id < 0 || id >= this.entityCount()) {
      throw "No Entity with that id";
    }
    if (id < this.mutableEntityCount()) {
      return this.mutableEntity(id);
    } else {
      return this.otherEntities[id - this.mutableEntityCount()];
    }
  }

  clear() {
    this.movableEntities = [];
    this.otherMutableEntities = [];
    this.otherEntities = [];
  }
}

// Perform elastic collision between MovableEntity entity1 and (possibly immovable) Entity entity2
export function performCollision(entity1: MovableEntity, entity2: Entity): void {
  if (entity2 instanceof MovableEntity && !entity2.unstoppable) {
    [entity1.velY, entity2.velY] = newVelocitiesElastic(entity1.velY, entity2.velY, entity1.mass, entity2.mass);
    [entity1.velX, entity2.velX] = newVelocitiesElastic(entity1.velX, entity2.velX, entity1.mass, entity2.mass);
  } else {
    if (entity1.collidingFromBottomWith(entity2)) {
      if (entity1.velY < 0) {
        if (entity2.bouncy) {
          entity1.velY = entity2.velY - entity1.velY;
        } else {
          entity1.velY = entity2.velY;
        }
        entity1.posY = entity2.posY + entity2.height;
      }
    }
    if (entity1.collidingFromTopWith(entity2)) {
      if (entity1.velY > 0) {
        if (entity2.bouncy) {
          entity1.velY = entity2.velY - entity1.velY;
        } else {
          entity1.velY = entity2.velY;
        }
        entity1.posY = entity2.posY - entity1.height;
      }
    }
    if (entity1.collidingFromLeftWith(entity2)) {
      if (entity1.velX > 0) {
        if (entity2.bouncy) {
          entity1.velX = entity2.velX - entity1.velX;
        } else {
          entity1.velX = entity2.velX;
        }
        entity1.posX = entity2.posX - entity1.width;
      }
    }
    if (entity1.collidingFromRightWith(entity2)) {
      if (entity1.velX < 0) {
        if (entity2.bouncy) {
          entity1.velX = entity2.velX - entity1.velX;
        } else {
          entity1.velX = entity2.velX;
        }
        entity1.posX = entity2.posX + entity2.width;
      }
    }
  }

  if (entity1.collidingFromBottomWith(entity2)) {
    entity1.hitFromTop();
    entity2.hitFromBelow();
  }
  if (entity1.collidingFromTopWith(entity2)) {
    entity1.hitFromBelow();
    entity2.hitFromTop();
  }
  if (entity1.collidingFromLeftWith(entity2)) {
    entity1.hitFromRight();
    entity2.hitFromLeft();
  }
  if (entity1.collidingFromRightWith(entity2)) {
    entity1.hitFromLeft();
    entity2.hitFromRight();
  }
}

function newVelocitiesElastic(u1: number, u2: number, m1: number, m2: number): number[] {
  let v1: number = (m1 - m2)/(m1 + m2)*u1 + (2*m2)/(m1 + m2)*u2;
  let v2: number = (2*m1)/(m1 + m2)*u1 + (m2 - m1)/(m1 + m2)*u2;
  return [v1, v2];
}
