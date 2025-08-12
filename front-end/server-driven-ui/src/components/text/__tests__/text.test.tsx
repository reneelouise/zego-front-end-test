import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from '../text';

describe('Text Component', () => {
  const mockConfig = {
    id: 'test-text',
    type: 'text' as const,
    label: 'Test Label',
  };

  it('renders text content correctly', () => {
    render(<Text id={mockConfig.id} label={mockConfig.label} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with custom id', () => {
    render(<Text id="custom-id" label="Test Label" />);
    const element = screen.getByText('Test Label');
    expect(element).toHaveAttribute('id', 'custom-id');
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <Text id="test" label="Test" variant="label" />
    );
    expect(screen.getByText('Test')).toBeInTheDocument();

    rerender(<Text id="test" label="Test" variant="heading" />);
    expect(screen.getByText('Test')).toBeInTheDocument();

    rerender(<Text id="test" label="Test" variant="paragraph" />);
    expect(screen.getByText('Test')).toBeInTheDocument();

    rerender(<Text id="test" label="Test" variant="error" />);
    expect(screen.getByText('Test')).toBeInTheDocument();

    rerender(<Text id="test" label="Test" variant="success" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders nothing when label is empty', () => {
    const { container } = render(<Text id="test" label="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when label is empty string', () => {
    const { container } = render(<Text id="test" label="" />);
    expect(container.firstChild).toBeNull();
  });

  it('has proper ARIA role', () => {
    render(<Text id="test" label="Test Label" />);
    expect(screen.getByText('Test Label')).toHaveAttribute('role', 'text');
  });

  it('supports aria-live for dynamic content', () => {
    render(<Text id="test" label="Test Label" ariaLive="polite" />);
    expect(screen.getByText('Test Label')).toHaveAttribute(
      'aria-live',
      'polite'
    );
  });

  it('supports aria-label for screen readers', () => {
    render(
      <Text id="test" label="Test Label" ariaLabel="Screen reader label" />
    );
    expect(screen.getByText('Test Label')).toHaveAttribute(
      'aria-label',
      'Screen reader label'
    );
  });

  it('handles long text content', () => {
    const longText =
      'This is a very long text that should be handled properly by the component without breaking the layout or causing any rendering issues';
    render(<Text id="test" label={longText} />);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('handles special characters in text', () => {
    const specialText = 'Text with special chars: & < > " \' € £ ¥';
    render(<Text id="test" label={specialText} />);
    expect(screen.getByText(specialText)).toBeInTheDocument();
  });
});
