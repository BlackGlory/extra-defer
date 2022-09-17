import { SyncDestructor } from '@src/sync-destructor'
import { getError } from 'return-style'

describe('SyncDestructor', () => {
  test('remove', () => {
    const executor = new SyncDestructor()
    const callback = jest.fn()
    executor.defer(callback)
    executor.defer(callback)

    executor.remove(callback)
    executor.execute()

    expect(callback).not.toBeCalled()
  })

  describe('execute', () => {
    test('no error', () => {
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = jest.fn(() => {
        count1 = ++counter
      })
      const fn2 = jest.fn(() => {
        count2 = ++counter
      })
      const destructor = new SyncDestructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      destructor.execute()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(2)
      expect(count2!).toBe(1)
    })

    test('error', () => {
      const customError = new Error('custom error')
      const fn1 = jest.fn()
      const fn2 = jest.fn(() => { throw customError })
      const destructor = new SyncDestructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      const err = getError(() => destructor.execute())
      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(1)
    })
  })

  describe('executeSettled', () => {
    test('no error', () => {
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = jest.fn(() => {
        count1 = ++counter
      })
      const fn2 = jest.fn(() => {
        count2 = ++counter
      })
      const destructor = new SyncDestructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      destructor.executeSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(2)
      expect(count2!).toBe(1)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = jest.fn()
      const fn2 = jest.fn(() => { throw customError })
      const destructor = new SyncDestructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      destructor.executeSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
    })
  })
})
