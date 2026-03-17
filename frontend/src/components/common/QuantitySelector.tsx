import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const buttonStyles = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 14 : 18;

  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-gray-100 rounded-xl p-1',
        size === 'sm' ? 'text-sm' : 'text-base'
      )}
    >
      <button
        onClick={decrease}
        disabled={quantity <= min}
        className={cn(
          buttonStyles,
          'flex items-center justify-center rounded-lg bg-white shadow-sm',
          'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
      >
        <Minus size={iconSize} />
      </button>
      <span className="w-8 text-center font-medium">{quantity}</span>
      <button
        onClick={increase}
        disabled={quantity >= max}
        className={cn(
          buttonStyles,
          'flex items-center justify-center rounded-lg bg-white shadow-sm',
          'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
