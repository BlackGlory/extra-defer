import { pass } from '@blackglory/pass'
import { each } from 'extra-promise'

export abstract class Executor {
  protected callbacks: Array<() => unknown | PromiseLike<unknown>> = []

  abstract defer(callback: () => unknown | PromiseLike<unknown>): void

  remove(callback: () => unknown | PromiseLike<unknown>): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  async execute(): Promise<void> {
    await this.all(1)
  }

  async executeSettled(): Promise<void> {
    await this.allSettled(1)
  }

  async all(concurrency: number = Infinity): Promise<void> {
    const callbacks = this.callbacks
    this.callbacks = []
    await each(callbacks, callback => callback(), concurrency)
  }

  async allSettled(concurrency: number = Infinity): Promise<void> {
    const callbacks = this.callbacks
    this.callbacks = []
    await each(callbacks, async callback => {
      try {
        await callback()
      } catch {
        pass()
      }
    }, concurrency)
  }
}
