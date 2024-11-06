import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../../test/utils';
import TicketAvailability from '../TicketAvailability';

describe('TicketAvailability', () => {
  const defaultProps = {
    eventId: '123',
    ticketType: 'VIP',
    initialAvailable: 50,
    totalCapacity: 100
  };

  beforeEach(() => {
    render(<TicketAvailability {...defaultProps} />);
  });

  it('displays the correct number of available tickets', () => {
    expect(screen.getByText('50 tickets remaining')).toBeInTheDocument();
  });

  it('displays the total capacity', () => {
    expect(screen.getByText('100 total')).toBeInTheDocument();
  });

  it('shows "Selling Fast" when availability is between 10% and 50%', () => {
    expect(screen.getByText('Selling Fast')).toBeInTheDocument();
  });

  it('shows progress bar with correct percentage', () => {
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });
});