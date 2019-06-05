export class CanvasAnimation {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d')!!;
    window.requestAnimationFrame(() => this.draw());
  }

  draw() {
    window.requestAnimationFrame(() => this.draw());
  }
}

const canvas = <HTMLCanvasElement>document.getElementById('game-canvas');
new CanvasAnimation(canvas);
