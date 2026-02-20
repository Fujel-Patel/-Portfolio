import { describe, it, expect } from 'vitest'
import { add, capitalize } from './helpers'

describe('Helper Functions', () => {
    it('should add two numbers correctly', () => {
        expect(add(2, 3)).toBe(5)
    })

    it('should capitalize the first letter of a string', () => {
        expect(capitalize('hello')).toBe('Hello')
    })

    it('should handle empty strings when capitalizing', () => {
        expect(capitalize('')).toBe('')
    })
})
