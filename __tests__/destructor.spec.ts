import { describe, test, expect, vi } from 'vitest'
import { Destructor } from '@src/destructor.js'
import { delay } from 'extra-promise'
import { getErrorPromise } from 'return-style'

const TIME_ERROR = 1

describe('Destructor', () => {
  test('size', () => {
    const executor = new Destructor()
    const fn1 = vi.fn()
    const fn2 = vi.fn()

    const size1 = executor.size
    executor.defer(fn1)
    const size2 = executor.size
    executor.defer(fn1)
    const size3 = executor.size
    executor.defer(fn2)
    const size4 = executor.size
    executor.remove(fn1)
    const size5 = executor.size

    expect(size1).toBe(0)
    expect(size2).toBe(1)
    expect(size3).toBe(2)
    expect(size4).toBe(3)
    expect(size5).toBe(1)
  })

  test('remove', async () => {
    const executor = new Destructor()
    const callback = vi.fn()
    executor.defer(callback)
    executor.defer(callback)

    executor.remove(callback)
    await executor.execute()

    expect(callback).not.toBeCalled()
  })

  describe('execute', () => {
    test('no error', async () => {
      let timestamp1: number
      let timestamp2: number
      const fn1 = vi.fn(async () => {
        timestamp1 = Date.now()
      })
      const fn2 = vi.fn(async () => {
        timestamp2 = Date.now()
        await delay(1000)
      })
      const destructor = new Destructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.execute()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(timestamp1! - timestamp2!).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn().mockRejectedValue(customError)
      const destructor = new Destructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      const err = await getErrorPromise(destructor.execute())
      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(1)
    })
  })

  describe('executeSettled', () => {
    test('no error', async () => {
      let timestamp1: number
      let timestamp2: number
      const fn1 = vi.fn(async () => {
        timestamp1 = Date.now()
      })
      const fn2 = vi.fn(async () => {
        timestamp2 = Date.now()
        await delay(1000)
      })
      const destructor = new Destructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.executeSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(timestamp1! - timestamp2!).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn().mockRejectedValue(customError)
      const destructor = new Destructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.executeSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
    })
  })

  describe('all', () => {
    test('no error', async () => {
      let timestamp1: number
      let timestamp2: number
      const fn1 = vi.fn(async () => {
        timestamp1 = Date.now()
      })
      const fn2 = vi.fn(async () => {
        timestamp2 = Date.now()
        await delay(1000)
      })
      const destructor = new Destructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.all()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(timestamp1! - timestamp2!).toBeLessThan(1000)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn().mockRejectedValue(customError)
      const destructor = new Destructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      const err = await getErrorPromise(destructor.all())
      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
    })
  })

  describe('allSettled', () => {
    test('no error', async () => {
      let timestamp1: number
      let timestamp2: number
      const fn1 = vi.fn(async () => {
        timestamp1 = Date.now()
      })
      const fn2 = vi.fn(async () => {
        timestamp2 = Date.now()
        await delay(1000)
      })
      const destructor = new Destructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.allSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(timestamp1! - timestamp2!).toBeLessThan(1000)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn().mockRejectedValue(customError)
      const destructor = new Destructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.allSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
    })
  })
})
