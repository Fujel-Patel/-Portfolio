import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoadingScreen from './LoadingScreen'

describe('LoadingScreen', () => {
    it('renders loading text and brand name', () => {
        const mockOnComplete = vi.fn()

        render(<LoadingScreen onLoadingComplete={mockOnComplete} />)

        // Check if the current brand initials are in the document
        expect(screen.getByText('P')).toBeInTheDocument()

        // Check for standard text elements
        expect(screen.getByText('Loading Portfolio')).toBeInTheDocument()
        expect(screen.getByText('Preparing 3D experience...')).toBeInTheDocument()
    })
})
