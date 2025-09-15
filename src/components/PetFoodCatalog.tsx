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
  Award
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const products = [
  {
    id: '1',
    name: 'Premium Dog Food - Chicken & Rice',
    brand: 'PetNutrition Pro',
    price: 3679,
    originalPrice: 4239,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop&crop=center',
    petType: 'dogs',
    dietaryNeeds: ['grain-free', 'high-protein'],
    weight: '15 lbs',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Organic Cat Food - Salmon',
    brand: 'NaturalPaws',
    price: 2639,
    rating: 4.9,
    reviews: 187,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&crop=center',
    petType: 'cats',
    dietaryNeeds: ['organic', 'omega-rich'],
    weight: '8 lbs',
    inStock: true,
    featured: false
  },
  {
    id: '3',
    name: 'Puppy Formula - Turkey & Sweet Potato',
    brand: 'GrowthPlus',
    price: 3119,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center',
    petType: 'dogs',
    dietaryNeeds: ['puppy', 'grain-free'],
    weight: '12 lbs',
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Senior Cat Food - Gentle Digestion',
    brand: 'WisePaws',
    price: 2399,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop&crop=center',
    petType: 'cats',
    dietaryNeeds: ['senior', 'digestive-health'],
    weight: '6 lbs',
    inStock: false,
    featured: false
  },
  {
    id: '5',
    name: 'Small Bird Seed Mix',
    brand: 'FeatherFresh',
    price: 1519,
    rating: 4.4,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=center',
    petType: 'birds',
    dietaryNeeds: ['natural', 'vitamin-enriched'],
    weight: '3 lbs',
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Rabbit Pellets - Timothy Hay',
    brand: 'BunnyBest',
    price: 1999,
    rating: 4.5,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop&crop=center',
    petType: 'rabbits',
    dietaryNeeds: ['fiber-rich', 'natural'],
    weight: '5 lbs',
    inStock: true,
    featured: false
  }
];

const brands = ['PetNutrition Pro', 'NaturalPaws', 'GrowthPlus', 'WisePaws', 'FeatherFresh', 'BunnyBest'];
const petTypes = ['dogs', 'cats', 'birds', 'rabbits'];
const dietaryNeeds = ['grain-free', 'organic', 'high-protein', 'senior', 'puppy', 'digestive-health', 'omega-rich', 'natural', 'vitamin-enriched', 'fiber-rich'];

interface PetFoodCatalogProps {
  onAddToCart: (item: any) => void;
  cartItemCount: number;
  onViewCart: () => void;
}

export function PetFoodCatalog({ onAddToCart, cartItemCount, onViewCart }: PetFoodCatalogProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 4800]);
  const [selectedPetTypes, setSelectedPetTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDietaryNeeds, setSelectedDietaryNeeds] = useState<string[]>([]);
  const [cartPulse, setCartPulse] = useState(false);

  const handleAddToCart = (product: any) => {
    onAddToCart(product);
    setCartPulse(true);
    setTimeout(() => setCartPulse(false), 1000);
  };

  const filteredProducts = products.filter(product => {
    if (selectedPetTypes.length > 0 && !selectedPetTypes.includes(product.petType)) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (selectedDietaryNeeds.length > 0 && !product.dietaryNeeds.some(need => selectedDietaryNeeds.includes(need))) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6EC18E]/20 to-[#FFD66B]/20 p-12"
        >
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=400&fit=crop&crop=center"
              alt="Pets eating nutritious food"
              className="w-full h-full object-cover opacity-20"
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
              Nutritious & Tasty
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-[#666666] max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Premium pet food made with the finest ingredients for your beloved companions' health and happiness.
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
                {/* Pet Type Filter */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h4 className="font-medium text-[#333333] mb-3">Pet Type</h4>
                  <div className="space-y-3">
                    {petTypes.map((type, index) => (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={type}
                          checked={selectedPetTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPetTypes([...selectedPetTypes, type]);
                            } else {
                              setSelectedPetTypes(selectedPetTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <label htmlFor={type} className="text-[#666666] cursor-pointer capitalize">
                          {type}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Brand Filter */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h4 className="font-medium text-[#333333] mb-3">Brand</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {brands.map((brand, index) => (
                      <motion.div
                        key={brand}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
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
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h4 className="font-medium text-[#333333] mb-3">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={4800}
                      min={0}
                      step={200}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-[#666666]">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Dietary Needs */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <h4 className="font-medium text-[#333333] mb-3">Dietary Needs</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {dietaryNeeds.map((need, index) => (
                      <motion.div
                        key={need}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.4 + index * 0.03 }}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={need}
                          checked={selectedDietaryNeeds.includes(need)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDietaryNeeds([...selectedDietaryNeeds, need]);
                            } else {
                              setSelectedDietaryNeeds(selectedDietaryNeeds.filter(n => n !== need));
                            }
                          }}
                        />
                        <label htmlFor={need} className="text-[#666666] cursor-pointer text-sm capitalize">
                          {need.replace('-', ' ')}
                        </label>
                      </motion.div>
                    ))}
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
                  Pet Food ({filteredProducts.length} products)
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
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
                              <Award className="w-3 h-3 mr-1" />
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
                          
                          <p className="text-sm text-[#666666] mb-3">{product.weight}</p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.dietaryNeeds.slice(0, 2).map((need) => (
                              <Badge key={need} variant="secondary" className="text-xs">
                                {need.replace('-', ' ')}
                              </Badge>
                            ))}
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
                              <span className="relative z-10">Add to Cart</span>
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-12 h-12 text-[#666666]" />
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">No products found</h3>
                <p className="text-[#666666] mb-6">Try adjusting your filters to see more results.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}