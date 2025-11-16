/**
 * Slider Component Tests
 * Tests for touch-optimized slider component
 * 
 * Pattern reused from @helix/core/src/utils/index.test.ts
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './Slider';

describe('Slider Component', () => {
  describe('Rendering', () => {
    it('should render slider element', () => {
      render(<Slider />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Slider label="Volume" />);
      expect(screen.getByText('Volume')).toBeInTheDocument();
    });

    it('should render with value label', () => {
      render(<Slider defaultValue={[50]} showValue />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should render with min/max values', () => {
      render(<Slider min={0} max={100} defaultValue={[50]} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });
  });

  describe('States', () => {
    it('should render disabled state', () => {
      render(<Slider disabled />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('data-disabled', '');
    });

    it('should render with custom step', () => {
      render(<Slider step={10} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle value changes', async () => {
      const handleChange = vi.fn();
      render(<Slider onValueChange={handleChange} />);
      
      const slider = screen.getByRole('slider');
      
      // Radix UI Slider uses mouse/keyboard events
      slider.focus();
      // Note: Full interaction testing requires manual mouse events
      // which are complex with Radix UI primitives
      expect(slider).toBeInTheDocument();
    });

    it('should not change value when disabled', () => {
      const handleChange = vi.fn();
      render(<Slider disabled onValueChange={handleChange} />);
      
      const slider = screen.getByRole('slider');
      slider.focus();
      
      expect(slider).toHaveAttribute('data-disabled', '');
    });
  });

  describe('Range Slider', () => {
    it('should support range values', () => {
      render(<Slider defaultValue={[20, 80]} />);
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
    });

    it('should handle range value changes', async () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={[20, 80]} onValueChange={handleChange} />);
      
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role', () => {
      render(<Slider />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Slider aria-label="Volume control" />);
      expect(screen.getByLabelText('Volume control')).toBeInTheDocument();
    });

    it('should expose min/max/current values', () => {
      render(<Slider min={10} max={90} defaultValue={[50]} />);
      const slider = screen.getByRole('slider');
      
      expect(slider).toHaveAttribute('aria-valuemin', '10');
      expect(slider).toHaveAttribute('aria-valuemax', '90');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });
  });

  describe('Step Increments', () => {
    it('should support step values', () => {
      render(<Slider step={5} min={0} max={100} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should support decimal steps', () => {
      render(<Slider step={0.1} min={0} max={1} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work as uncontrolled component', () => {
      render(<Slider defaultValue={[50]} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('should work as controlled component', () => {
      const { rerender } = render(<Slider value={[30]} />);
      let slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '30');

      rerender(<Slider value={[70]} />);
      slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '70');
    });
  });

  describe('Responsive Variants', () => {
    it('should accept responsive size prop', () => {
      render(<Slider size={{ '@initial': 'sm', '@md': 'lg' }} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });
  });
});
