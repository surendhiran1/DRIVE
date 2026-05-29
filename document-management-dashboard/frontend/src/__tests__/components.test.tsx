import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.js';
import UploadCard from '../components/UploadCard.js';
import NotificationDropdown from '../components/NotificationDropdown.js';

describe('Frontend UI Reusable Components', () => {
  it('ProgressBar renders with correct width style', () => {
    const { container } = render(<ProgressBar progress={45} />);
    const bar = container.querySelector('.bg-brand-500');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveStyle('width: 45%');
  });

  it('UploadCard displays details of file in progress', () => {
    const testItem = {
      id: 'item-1',
      name: 'resume.pdf',
      size: 153600, // 150 KB
      progress: 75,
      status: 'uploading' as const,
      speed: '1.2 MB/s'
    };

    render(<UploadCard item={testItem} />);
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('150 KB')).toBeInTheDocument();
    expect(screen.getByText('Uploading... 75%')).toBeInTheDocument();
    expect(screen.getByText('1.2 MB/s')).toBeInTheDocument();
  });

  it('NotificationDropdown lists notifications when opened', () => {
    const mockNotifications = [
      {
        id: 'n-1',
        message: 'Database check complete',
        type: 'info' as const,
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

    const mockMarkRead = vi.fn();
    const mockMarkAllRead = vi.fn();

    render(
      <BrowserRouter>
        <NotificationDropdown
          isOpen={true}
          onClose={() => {}}
          notifications={mockNotifications}
          onMarkRead={mockMarkRead}
          onMarkAllRead={mockMarkAllRead}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Database check complete')).toBeInTheDocument();
    expect(screen.getByText('Mark all read')).toBeInTheDocument();
  });
});
