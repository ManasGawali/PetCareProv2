import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  ShoppingCart, 
  Plus,
  Heart,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const products = [
  {
    id: '1',
    name: 'Luxury Pet Bed - Memory Foam',
    brand: 'ComfortPaws',
    price: 7199,
    originalPrice: 8799,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center',
    category: 'beds',
    material: 'memory-foam',
    size: 'Large',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Interactive Puzzle Toy',
    brand: 'BrainTeasers',
    price: 1999,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=center',
    category: 'toys',
    material: 'plastic',
    size: 'Medium',
    inStock: true,
    featured: false
  },
  {
    id: '3',
    name: 'Leather Dog Collar - Handcrafted',
    brand: 'ArtisanPets',
    price: 3679,
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&crop=center',
    category: 'collars',
    material: 'leather',
    size: 'Adjustable',
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Retractable Dog Leash',
    brand: 'SafeWalk',
    price: 2639,
    rating: 4.5,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=center',
    category: 'leashes',
    material: 'nylon',
    size: '16ft',
    inStock: false,
    featured: false
  },
  {
    id: '5',
    name: 'Cat Scratching Post - Sisal',
    brand: 'ClawCare',
    price: 5439,
    rating: 4.7,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop&crop=center',
    category: 'toys',
    material: 'sisal',
    size: 'Tall',
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Elevated Food Bowl Set',
    brand: 'DiningElegance',
    price: 4399,
    rating: 4.4,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center',
    category: 'bowls',
    material: 'stainless-steel',
    size: 'Double',
    inStock: true,
    featured: false
  }
];

const brands = ['ComfortPaws', 'BrainTeasers', 'ArtisanPets', 'SafeWalk', 'ClawCare', 'DiningElegance'];
const categories = ['toys', 'beds', 'collars', 'leashes', 'bowls'];
const materials = ['memory-foam', 'plastic', 'leather', 'nylon', 'sisal', 'stainless-steel'];

interface PetAccessoriesProps {
  onAddToCart: (item: any) => void;
  cartItemCount: number;
  onViewCart: () => void;
}

export function PetAccessories({ onAddToCart, cartItemCount, onViewCart }: PetAccessoriesProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 9600]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [cartPulse, setCartPulse] = useState(false);

  const handleAddToCart = (product: any) => {
    onAddToCart(product);
    setCartPulse(true);
    setTimeout(() => setCartPulse(false), 1000);
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
    if (selectedMaterials.length > 0 && !selectedMaterials.includes(product.material)) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section with Floating Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFD66B]/20 to-[#F4C2C2]/20 p-12 min-h-[300px] flex items-center justify-center"
        >
          {/* Floating Accessories */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 left-16 w-16 h-16 bg-[#6EC18E]/30 rounded-full"
            />
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-20 right-20 w-12 h-12 bg-[#F4C2C2]/40 rounded-lg"
            />
            <motion.div
              animate={{ y: [-5, 15, -5], rotate: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 left-24 w-20 h-20 bg-[#FFD66B]/35 rounded-full"
            />
            <motion.div
              animate={{ y: [15, -5, 15], rotate: [0, -10, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-16 right-32 w-14 h-14 bg-[#6EC18E]/25 rounded-lg"
            />
          </div>

          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl font-bold text-[#333333] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Premium Pet Accessories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-[#666666] max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Everything your pet needs for comfort, play, and style. From cozy beds to interactive toys.
            </motion.p>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`w-80 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden lg:block'}`}
          >
            <Card className="p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#333333]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden"
                >
                  <motion.div
                    animate={{ rotate: filtersOpen ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </motion.div>
                </Button>
              </div>

              <div className="space-y-6">
                {/* Product Type Filter */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h4 className="font-medium text-[#333333] mb-3">Product Type</h4>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <label htmlFor={category} className="text-[#666666] cursor-pointer capitalize">
                          {category}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Material Filter */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h4 className="font-medium text-[#333333] mb-3">Material</h4>
                  <div className="space-y-3">
                    {materials.map((material, index) => (
                      <motion.div
                        key={material}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={material}
                          checked={selectedMaterials.includes(material)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMaterials([...selectedMaterials, material]);
                            } else {
                              setSelectedMaterials(selectedMaterials.filter(m => m !== material));
                            }
                          }}
                        />
                        <label htmlFor={material} className="text-[#666666] cursor-pointer text-sm capitalize">
                          {material.replace('-', ' ')}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Brand Filter */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h4 className="font-medium text-[#333333] mb-3">Brand</h4>
                  <div className="space-y-3">
                    {brands.map((brand, index) => (
                      <motion.div
                        key={brand}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                        />
                        <label htmlFor={brand} className="text-[#666666] cursor-pointer text-sm">
                          {brand}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Price Range */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <h4 className="font-medium text-[#333333] mb-3">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={9600}
                      min={0}
                      step={400}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-[#666666]">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full justify-between"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </div>
                <motion.div
                  animate={{ rotate: filtersOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#333333]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Pet Accessories ({filteredProducts.length} products)
                </h2>
              </div>
              
              {/* Cart Icon */}
              <motion.button
                onClick={onViewCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 bg-[#6EC18E] text-white rounded-full shadow-lg"
                animate={cartPulse ? { scale: [1, 1.2, 1] } : {}}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#E74C3C] text-white rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    {cartItemCount}
                  </motion.div>
                )}
                {cartPulse && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#6EC18E]"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1 }}
                  />
                )}
              </motion.button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.featured && (
                            <Badge className="bg-[#FFD66B] text-[#333333] flex items-center">
                              <Zap className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {!product.inStock && (
                            <Badge variant="destructive">
                              Out of Stock
                            </Badge>
                          )}
                          {product.originalPrice && (
                            <Badge className="bg-[#E74C3C] text-white">
                              Sale
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="w-5 h-5 text-[#666666] hover:text-[#E74C3C] transition-colors" />
                        </motion.button>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#6EC18E] font-medium uppercase tracking-wide">
                              {product.brand}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-[#FFD66B] text-[#FFD66B]" />
                              <span className="text-sm font-medium text-[#333333]">{product.rating}</span>
                              <span className="text-xs text-[#666666]">({product.reviews})</span>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-bold text-[#333333] mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <span className="text-sm text-[#666666]">{product.size}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-[#333333]">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-[#666666] line-through">₹{product.originalPrice}</span>
                            )}
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                              size="sm"
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.6 }}
                              />
                              <Plus className="w-4 h-4 mr-2" />
                              <span className="relative z-10">Add</span>
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 text-center bg-gradient-to-r from-[#6EC18E]/10 to-[#FFD66B]/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Get 10% off your first accessory order!
              </h3>
              <p className="text-[#666666] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                Sign up for our newsletter and get exclusive discounts on premium pet accessories.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white px-8 py-4 text-lg relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Claim Your Discount
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-2"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-12 h-12 text-[#666666]" />
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">No accessories found</h3>
                <p className="text-[#666666] mb-6">Try adjusting your filters to see more results.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}