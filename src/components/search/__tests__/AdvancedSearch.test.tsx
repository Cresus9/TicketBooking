import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import AdvancedSearch from '../AdvancedSearch';

describe('AdvancedSearch', () => {
  const mockCategories = ['Music', 'Sports', 'Arts'];
  const mockLocations = ['Accra', 'Lagos', 'Nairobi'];
  const mockOnSearch = vi.fn();

  const defaultProps = {
    onSearch: mockOnSearch,
    categories: mockCategories,
    locations: mockLocations
  };

  it('renders search input and filter buttons', () => {
    render(<AdvancedSearch {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search events...')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('shows filter options when filters button is clicked', () => {
    render(<AdvancedSearch {...defaultProps} />);
    fireEvent.click(screen.getByText('Filters'));
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('calls onSearch with correct filters when form is submitted', () => {
    render(<AdvancedSearch {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search events...');
    fireEvent.change(searchInput, { target: { value: 'concert' } });
    fireEvent.submit(searchInput.closest('form')!);
    expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({
      query: 'concert'
    }));
  });

  it('updates filters when selections change', () => {
    render(<AdvancedSearch {...defaultProps} />);
    fireEvent.click(screen.getByText('Filters'));
    
    const locationSelect = screen.getByLabelText('Location');
    fireEvent.change(locationSelect, { target: { value: 'Accra' } });
    
    const categorySelect = screen.getByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'Music' } });
    
    fireEvent.submit(screen.getByRole('form'));
    
    expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({
      location: 'Accra',
      category: 'Music'
    }));
  });
});