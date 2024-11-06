import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../../test/utils';
import TicketScanner from '../TicketScanner';

// Mock QR Scanner
vi.mock('@yudiel/react-qr-scanner', () => ({
  QrScanner: vi.fn().mockImplementation(({ onDecode }) => (
    <button onClick={() => onDecode('mock-ticket-id')}>Scan QR Code</button>
  ))
}));

describe('TicketScanner', () => {
  const mockOnScan = vi.fn();

  beforeEach(() => {
    mockOnScan.mockReset();
  });

  it('shows scanning instructions initially', () => {
    render(<TicketScanner onScan={mockOnScan} />);
    expect(screen.getByText('Position the QR code within the frame to scan')).toBeInTheDocument();
  });

  it('handles successful scan', async () => {
    mockOnScan.mockResolvedValue(true);
    render(<TicketScanner onScan={mockOnScan} />);
    
    fireEvent.click(screen.getByText('Scan QR Code'));
    
    await waitFor(() => {
      expect(screen.getByText('Ticket validated successfully!')).toBeInTheDocument();
    });
  });

  it('handles failed scan', async () => {
    mockOnScan.mockResolvedValue(false);
    render(<TicketScanner onScan={mockOnScan} />);
    
    fireEvent.click(screen.getByText('Scan QR Code'));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid ticket!')).toBeInTheDocument();
    });
  });

  it('handles scan errors', async () => {
    mockOnScan.mockRejectedValue(new Error('Scan failed'));
    render(<TicketScanner onScan={mockOnScan} />);
    
    fireEvent.click(screen.getByText('Scan QR Code'));
    
    await waitFor(() => {
      expect(screen.getByText('Error validating ticket')).toBeInTheDocument();
    });
  });

  it('resets scanner when reset button is clicked', async () => {
    mockOnScan.mockResolvedValue(true);
    render(<TicketScanner onScan={mockOnScan} />);
    
    fireEvent.click(screen.getByText('Scan QR Code'));
    await waitFor(() => {
      expect(screen.getByText('Ticket validated successfully!')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByLabelText('Reset scanner'));
    expect(screen.getByText('Position the QR code within the frame to scan')).toBeInTheDocument();
  });
});