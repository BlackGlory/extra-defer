import { Executor } from './executor'
import { Awaitable } from '@blackglory/prelude'

export class Destructor extends Executor {
  defer(callback: () => Awaitable<unknown>): void {
    this.callbacks.unshift(callback)
  }
}
