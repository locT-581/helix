/**
 * Input Component Tests
 * Tests for touch-optimized input component
 * 
 * Pattern reused from @helix/core/src/utils/index.test.ts
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should render with error state', () => {
      render(<Input state="error" error="Invalid input" />);
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });

    it('should render with success state', () => {
      render(<Input state="success" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with warning state', () => {
      render(<Input state="warning" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should render disabled state', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should render required state', () => {
      render(<Input required label="Required field" />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should render fullWidth state', () => {
      render(<Input fullWidth />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Hello');
      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('Hello');
    });

    it('should handle focus events', async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();

      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle blur events', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();

      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should not accept input when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input disabled onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Test');
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      render(<Input size="sm" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<Input size="md" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Input size="lg" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input', () => {
      render(<Input label="Email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    it('should associate error message with input', () => {
      render(<Input state="error" error="Invalid email" aria-describedby="error" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should support placeholder', () => {
      render(<Input placeholder="john@example.com" />);
      expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('should support email type', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should support password type', () => {
      const { container } = render(<Input type="password" />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should support number type', () => {
      render(<Input type="number" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });
});
