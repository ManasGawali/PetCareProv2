import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  ArrowLeft, 
  Tag, 
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartItem {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category?: string;
  size?: string;
  weight?: string;
}

interface CartPageProps {
  items: CartItem[];
  onUpdateItem: (itemId: string, quantity: number) => void;
  onContinueShopping: () => void;
}

export function CartPage({ items, onUpdateItem, onContinueShopping }: CartPageProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 4000 ? 0 : 799;
  const discount = 0; // Could be calculated based on promo code
  const total = subtotal + deliveryFee - discount;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    onUpdateItem(itemId, Math.max(0, newQuantity));
  };

  const handleRemoveItem = (itemId: string) => {
    onUpdateItem(itemId, 0);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-24">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-32 h-32 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <ShoppingCart className="w-16 h-16 text-[#666666]" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Your cart is empty
            </h1>
            <p className="text-xl text-[#666666] mb-8" style={{ fontFamily: 'var(--font-body)' }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onContinueShopping}
                size="lg"
                className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white px-8 py-4 text-lg relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Continue Shopping
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-[#333333] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Shopping Cart
            </h1>
            <p className="text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={onContinueShopping}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 border border-[#E0E0E0] rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#333333] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                          {item.name}
                        </h3>
                        {item.brand && (
                          <p className="text-sm text-[#6EC18E] font-medium mb-1">{item.brand}</p>
                        )}
                        <div className="flex items-center space-x-2 mb-2">
                          {item.size && <Badge variant="outline" className="text-xs">{item.size}</Badge>}
                          {item.weight && <Badge variant="outline" className="text-xs">{item.weight}</Badge>}
                          {item.category && <Badge variant="secondary" className="text-xs capitalize">{item.category}</Badge>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-[#333333]">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-[#666666] line-through">₹{item.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:border-[#6EC18E] hover:bg-[#6EC18E]/10 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.span
                          key={item.quantity}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="w-12 text-center font-semibold"
                        >
                          {item.quantity}
                        </motion.span>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:border-[#6EC18E] hover:bg-[#6EC18E]/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1, color: '#E74C3C' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-[#666666] transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="sticky top-32 space-y-6"
            >
              {/* Promo Code */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Promo Code
                </h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter code"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Order Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Order Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[#666666]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  
                  <div className="flex justify-between text-[#666666]">
                    <span>Delivery Fee</span>
                    <div className="text-right">
                      {deliveryFee === 0 ? (
                        <span className="text-[#6EC18E] font-medium">FREE</span>
                      ) : (
                        <span>₹{deliveryFee}</span>
                      )}
                    </div>
                  </div>
                  
                  {deliveryFee > 0 && (
                    <p className="text-xs text-[#666666]">
                      Free delivery on orders over ₹4000
                    </p>
                  )}
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-[#6EC18E]">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold text-[#333333]">
                    <span>Total</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      ₹{total.toFixed(0)}
                    </motion.span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  <Button
                    size="lg"
                    className="w-full bg-[#6EC18E] hover:bg-[#5BB07F] text-white relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </span>
                  </Button>
                </motion.div>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-[#666666]">
                    <Shield className="w-4 h-4 text-[#6EC18E]" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-[#666666]">
                    <Truck className="w-4 h-4 text-[#6EC18E]" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}