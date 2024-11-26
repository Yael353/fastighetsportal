export class RESPONSE_404 extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, RESPONSE_404.prototype);
  }
}
export class RESPONSE_403 extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, RESPONSE_403.prototype);
  }
}
export class RESPONSE_500 extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, RESPONSE_500.prototype);
  }
}
