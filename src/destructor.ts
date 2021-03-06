import { Executor } from './executor'

export class Destructor extends Executor {
  defer(callback: () => unknown | PromiseLike<unknown>): void {
    this.callbacks.unshift(callback)
  }
}
