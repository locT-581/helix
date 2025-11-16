/**
 * Switch Component Tests
 * Tests for touch-optimized switch component
 * 
 * Pattern reused from @helix/core/src/utils/index.test.ts
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch Component', () => {
  describe('Rendering', () => {
    it('should render switch element', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Switch label="Enable notifications" />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('should render checked state', () => {
      render(<Switch defaultChecked />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should render unchecked state', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });
  });

  describe('States', () => {
    it('should render disabled state', () => {
      render(<Switch disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });

    it('should render required state', () => {
      render(<Switch required />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-required', 'true');
    });

    it('should render fullWidth state', () => {
      render(<Switch fullWidth label="Full width" />);
      expect(screen.getByText('Full width')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should toggle on click', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'checked');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('should handle checked change callback', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Switch onCheckedChange={handleChange} />);
      const switchElement = screen.getByRole('switch');

      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);

      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('should not toggle when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Switch disabled onCheckedChange={handleChange} />);
      const switchElement = screen.getByRole('switch');

      await user.click(switchElement);
      expect(handleChange).not.toHaveBeenCalled();
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('should toggle with keyboard (Space)', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      
      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      await user.keyboard(' '); // Space key
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      render(<Switch size="sm" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<Switch size="md" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Switch size="lg" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should associate label with switch', () => {
      render(<Switch label="Dark mode" />);
      expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Switch aria-label="Toggle feature" />);
      expect(screen.getByLabelText('Toggle feature')).toBeInTheDocument();
    });

    it('should expose checked state via aria', () => {
      const { rerender } = render(<Switch checked={false} />);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      rerender(<Switch checked={true} />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work as uncontrolled component', async () => {
      const user = userEvent.setup();
      render(<Switch defaultChecked />);
      
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('should work as controlled component', () => {
      const { rerender } = render(<Switch checked={false} />);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      rerender(<Switch checked={true} />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('Responsive Variants', () => {
    it('should accept responsive size prop', () => {
      render(<Switch size={{ '@initial': 'sm', '@md': 'lg' }} />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
  });
});
