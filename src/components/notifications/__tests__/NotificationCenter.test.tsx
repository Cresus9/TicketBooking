import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import NotificationCenter from '../NotificationCenter';
import { useNotifications } from '../../../context/NotificationContext';

vi.mock('../../../context/NotificationContext');

describe('NotificationCenter', () => {
  const mockNotifications = [
    {
      id: '1',
      title: 'New Event',
      message: 'A new event has been added',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    (useNotifications as any).mockReturnValue({
      notifications: mockNotifications,
      unreadCount: 1,
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
      deleteNotification: vi.fn()
    });
  });

  it('renders notifications list', () => {
    render(<NotificationCenter />);
    expect(screen.getByText('New Event')).toBeInTheDocument();
    expect(screen.getByText('A new event has been added')).toBeInTheDocument();
  });

  it('shows mark all as read button when there are unread notifications', () => {
    render(<NotificationCenter />);
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });

  it('calls markAsRead when mark as read button is clicked', () => {
    const { markAsRead } = useNotifications();
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Mark as read'));
    expect(markAsRead).toHaveBeenCalledWith('1');
  });

  it('calls markAllAsRead when mark all as read button is clicked', () => {
    const { markAllAsRead } = useNotifications();
    render(<NotificationCenter />);
    fireEvent.click(screen.getByText('Mark all as read'));
    expect(markAllAsRead).toHaveBeenCalled();
  });

  it('shows empty state when there are no notifications', () => {
    (useNotifications as any).mockReturnValue({
      notifications: [],
      unreadCount: 0,
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn()
    });
    
    render(<NotificationCenter />);
    expect(screen.getByText('No notifications yet')).toBeInTheDocument();
  });
});