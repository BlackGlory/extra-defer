import { describe, test, expect, vi } from 'vitest'
import { GeneratorConstructor } from '@src/generator-constructor.js'
import { toArray } from '@blackglory/prelude'
import { getError } from 'return-style'

describe('GeneratorConstructor', () => {
  test('size', () => {
    const executor = new GeneratorConstructor()
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

  test('remove', () => {
    const executor = new GeneratorConstructor()
    const callback = vi.fn()
    executor.defer(callback)
    executor.defer(callback)

    executor.remove(callback)
    toArray(executor.execute())

    expect(callback).not.toBeCalled()
  })

  describe('execute', () => {
    test('no error', () => {
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = vi.fn(() => {
        count1 = ++counter
      })
      const fn2 = vi.fn(() => {
        count2 = ++counter
      })
      const destructor = new GeneratorConstructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      toArray(destructor.execute())
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(1)
      expect(count2!).toBe(2)
    })

    test('error', () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn(function* () {
        throw customError
      })
      const fn2 = vi.fn()
      const destructor = new GeneratorConstructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      const err = getError(() => toArray(destructor.execute()))
      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(0)
    })
  })

  describe('executeSettled', () => {
    test('no error', () => {
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = vi.fn(() => {
        count1 = ++counter
      })
      const fn2 = vi.fn(() => {
        count2 = ++counter
      })
      const destructor = new GeneratorConstructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      toArray(destructor.executeSettled())
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(1)
      expect(count2!).toBe(2)
    })

    test('error', () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn(function* () {
        throw customError
      })
      const fn2 = vi.fn()
      const destructor = new GeneratorConstructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      toArray(destructor.executeSettled())
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
    })
  })
})
