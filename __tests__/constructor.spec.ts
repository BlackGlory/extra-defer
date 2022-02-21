import { Constructor } from '@src/constructor'
import { delay } from 'extra-promise'
import { getErrorPromise } from 'return-style'

const TIME_ERROR = 1

describe('Constructor', () => {
  describe('execute', () => {
    test('no error', async () => {
      let timestamp1: number
      let timestamp2: number
      const fn1 = jest.fn(async () => {
        timestamp1 = Date.now()
        await delay(1000)
      })
      const fn2 = jest.fn(async () => {
        timestamp2 = Date.now()
      })
      const destructor = new Constructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.execute()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(timestamp2! - timestamp1!).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = jest.fn().mockRejectedValue(customError)
      const fn2 = jest.fn()
      const destructor = new Constructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      const err = await getErrorPromise(destructor.execute())
      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(0)
    })
  })

  describe('executeSettled', () => {
    test('no error', async () => {
      let timestamp1: number
      let timestamp2: number
      const fn1 = jest.fn(async () => {
        timestamp1 = Date.now()
        await delay(1000)
      })
      const fn2 = jest.fn(async () => {
        timestamp2 = Date.now()
      })
      const destructor = new Constructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.executeSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(timestamp2! - timestamp1!).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = jest.fn().mockRejectedValue(customError)
      const fn2 = jest.fn()
      const destructor = new Constructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

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
      const fn1 = jest.fn(async () => {
        timestamp1 = Date.now()
        await delay(1000)
      })
      const fn2 = jest.fn(async () => {
        timestamp2 = Date.now()
      })
      const destructor = new Constructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.all()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(timestamp2! - timestamp1!).toBeLessThan(1000)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = jest.fn().mockRejectedValue(customError)
      const fn2 = jest.fn()
      const destructor = new Constructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

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
      const fn1 = jest.fn(async () => {
        timestamp1 = Date.now()
        await delay(1000)
      })
      const fn2 = jest.fn(async () => {
        timestamp2 = Date.now()
      })
      const destructor = new Constructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.allSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(timestamp2! - timestamp1!).toBeLessThan(1000)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = jest.fn().mockRejectedValue(customError)
      const fn2 = jest.fn()
      const destructor = new Constructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await destructor.allSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
    })
  })
})
