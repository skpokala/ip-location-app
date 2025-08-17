import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /IP Location App/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the info text', () => {
    render(<Home />)
    const text = screen.getByText(/Your IP information will appear here/i)
    expect(text).toBeInTheDocument()
  })
})
