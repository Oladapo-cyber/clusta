import { useCart } from '../context/CartContext';

interface CartPopoverProps {
  onOrder: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const CartPopover = ({ onOrder, onClose, isOpen }: CartPopoverProps) => {
  const { items, addToCart, removeFromCart, decreaseQuantity, itemCount } = useCart();

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const priceStr = String(item.price).replace(/[^0-9.]/g, '');
    const price = parseFloat(priceStr);
    return acc + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  // Formatting currency manually since we have varying formats
  const formattedTotal = `₦${subtotal.toLocaleString()}`;

  // Close when clicking outside logic can be added later or handled by parent layout overlay
  // For now, this is a popover controlled by the parent

  return (
    <div className="absolute top-12 right-0 w-80 md:w-96 bg-[#1F2937] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
        <h3 className="text-white font-bold text-lg font-heading">Shopping Cart ({itemCount})</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Items List */}
      <div className="max-h-[60vh] overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-3 items-start bg-gray-800/50 p-2 rounded-lg">
              {/* Product Image */}
              <div className="w-16 h-16 bg-white rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
              </div>

              {/* Info */}
              <div className="flex-grow">
                <h4 className="text-white font-semibold text-sm line-clamp-1">{item.name}</h4>
                <p className="text-[#45AAB8] font-bold text-sm mt-1">{item.price}</p>
                
                {/* Controls */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 bg-gray-700 rounded-md px-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseQuantity(item.id);
                      }}
                      className="text-gray-400 hover:text-white px-1 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-white text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const { quantity, ...product } = item;
                        addToCart(product);
                      }}
                      className="text-gray-400 hover:text-white px-1 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       removeFromCart(item.id);
                     }}
                     className="ml-auto text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                     title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-sm">Total Price:</span>
            <span className="text-white font-bold text-xl">{formattedTotal}</span>
          </div>
          <button
            onClick={onOrder}
            className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Order</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPopover;
