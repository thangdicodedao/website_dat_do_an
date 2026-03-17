import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils';
import QuantitySelector from '../common/QuantitySelector';
import { useAppDispatch } from '../../hooks';
import { updateCartItem, removeFromCart } from '../../store/slices/cartSlice';
import { useToast } from '../common/Toast';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const handleQuantityChange = (quantity: number) => {
    dispatch(updateCartItem({ cartItemId: item.id, quantity }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    showToast('success', `Đã xóa ${item.product.name} khỏi giỏ hàng`);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm">
      {/* Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-gray-900 line-clamp-2">
            {item.product.name}
          </h4>
          <button
            onClick={handleRemove}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {item.notes && (
          <p className="text-sm text-gray-500 mt-1">Ghi chú: {item.notes}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold text-orange-600">
            {formatPrice(item.price * item.quantity)}
          </span>
          <QuantitySelector
            quantity={item.quantity}
            onChange={handleQuantityChange}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
