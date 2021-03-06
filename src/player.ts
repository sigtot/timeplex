import {
  FRICTION_ACC,
  GRAVITATIONAL_CONSTANT, H_KEY_CODE, JUMP_SPEED, K_KEY_CODE, L_KEY_CODE,
  LEFT_KEY_CODE,
  MAX_RUN_SPEED,
  PLAYER_MASS,
  PLAYER_SIZE, RIGHT_KEY_CODE,
  RUN_ACC, SPACE_KEY_CODE, STATIONARY_VELOCITY_THRESH, UP_KEY_CODE
} from "./config";
import {MovableEntity} from "./engine";

class KeyFrame {
  constructor(public action: string, public tick: number) {};
}

export class Player extends MovableEntity {
  private keyFrames: KeyFrame[] = [];
  private levelTick: number = 0;
  private leftKeyDown: boolean = false;
  private rightKeyDown: boolean = false;
  constructor(public posX: number, public posY: number) {
    super();
    this.accY = GRAVITATIONAL_CONSTANT;
    this.height = PLAYER_SIZE;
    this.width = PLAYER_SIZE;
    this.mass = PLAYER_MASS;
  }
  incrementState() {

    if (this.leftKeyDown && !this.rightKeyDown && -MAX_RUN_SPEED < this.velX && this.inContactFromBelow) {
        this.accX = -RUN_ACC;
    } else if (this.rightKeyDown && !this.leftKeyDown && this.velX < MAX_RUN_SPEED && this.inContactFromBelow) {
        this.accX = RUN_ACC;
    } else if (!this.leftKeyDown && !this.rightKeyDown && this.inContactFromBelow) {
      if (Math.abs(this.velX) < STATIONARY_VELOCITY_THRESH) {
        this.velX = 0;
      } else {
        this.accX = -1 * Math.sign(this.velX) * FRICTION_ACC;
      }
    } else {
      this.accX = 0;
    }
    super.incrementState();
  }

  tick() {
    this.levelTick++;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#333333";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }

  grabKeyboard(): void {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }
  releaseKeyboard(): void {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
  handleKeyDown = (event: KeyboardEvent) => {
    this.handleKeyCode(event.code);
    this.keyFrames.push(new KeyFrame(event.code, this.levelTick));
  };
  handleKeyCode = (keyCode: string) => {
    switch (keyCode) {
      case LEFT_KEY_CODE:
        this.leftKeyDown = true;
        break;
      case RIGHT_KEY_CODE:
        this.rightKeyDown = true;
        break;
      case SPACE_KEY_CODE:
        this.jumpIfOnTheGround();
        break;
      case UP_KEY_CODE:
        this.jumpIfOnTheGround();
        break;
      case H_KEY_CODE:
        this.leftKeyDown = true;
        break;
      case L_KEY_CODE:
        this.rightKeyDown = true;
        break;
      case K_KEY_CODE:
        this.jumpIfOnTheGround();
        break;
    }
  };
  jumpIfOnTheGround() {
    if (this.inContactFromBelow) {
      this.velY = -JUMP_SPEED;
    }

  }
  handleKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case LEFT_KEY_CODE:
        this.leftKeyDown = false;
        break;
      case RIGHT_KEY_CODE:
        this.rightKeyDown = false;
        break;
      case H_KEY_CODE:
        this.leftKeyDown = false;
        break;
      case L_KEY_CODE:
        this.rightKeyDown = false;
        break;
    }
  };
}
