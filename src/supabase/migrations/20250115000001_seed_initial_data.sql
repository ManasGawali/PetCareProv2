-- Seed initial data for PetCare Pro Deluxe
-- This script populates the database with sample data for development and demo

-- Insert service categories
INSERT INTO public.service_categories (name, description, icon, active) VALUES
('grooming', 'Professional pet grooming services', 'scissors', true),
('walking', 'Dog walking and exercise services', 'map-pin', true),
('sitting', 'Pet sitting and boarding services', 'home', true),
('training', 'Pet training and behavior services', 'graduation-cap', true),
('veterinary', 'In-home veterinary services', 'heart-pulse', true),
('spa', 'Luxury spa and wellness services', 'sparkles', true)
ON CONFLICT (name) DO NOTHING;

-- Insert services
INSERT INTO public.services (name, description, price, duration, category_id, image_url, rating, total_reviews, active) VALUES
(
  'Premium Dog Grooming',
  'Complete grooming service including bath, haircut, nail trimming, and ear cleaning. Our certified groomers use premium products and gentle techniques.',
  2500,
  120,
  (SELECT id FROM public.service_categories WHERE name = 'grooming'),
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
  4.8,
  156,
  true
),
(
  'Professional Dog Walking',
  'Professional dog walking service with GPS tracking and photo updates. Perfect for busy pet parents who want their dogs to get exercise and socialization.',
  800,
  60,
  (SELECT id FROM public.service_categories WHERE name = 'walking'),
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
  4.9,
  243,
  true
),
(
  'Overnight Pet Sitting',
  'Overnight pet sitting in your home with feeding, walking, and companionship. Your pets stay comfortable in their familiar environment.',
  1500,
  720,
  (SELECT id FROM public.service_categories WHERE name = 'sitting'),
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
  4.7,
  89,
  true
),
(
  'Basic Training Session',
  'One-on-one training session focusing on basic commands and behavior. Our certified trainers use positive reinforcement techniques.',
  1200,
  90,
  (SELECT id FROM public.service_categories WHERE name = 'training'),
  'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
  4.6,
  67,
  true
),
(
  'In-Home Veterinary Checkup',
  'Professional veterinary consultation and health checkup in the comfort of your home. Includes basic health assessment and advice.',
  3000,
  60,
  (SELECT id FROM public.service_categories WHERE name = 'veterinary'),
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
  4.9,
  134,
  true
),
(
  'Luxury Spa Treatment',
  'Premium spa treatment with aromatherapy bath, massage, and nail care. The ultimate relaxation experience for your pet.',
  3500,
  150,
  (SELECT id FROM public.service_categories WHERE name = 'spa'),
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  4.8,
  92,
  true
),
(
  'Cat Grooming Special',
  'Specialized grooming for cats including gentle bath, brushing, nail trimming, and ear cleaning. Cat-friendly environment and techniques.',
  2200,
  90,
  (SELECT id FROM public.service_categories WHERE name = 'grooming'),
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  4.7,
  78,
  true
),
(
  'Puppy Training Package',
  'Comprehensive puppy training including house training, basic commands, and socialization. Perfect for new puppy owners.',
  2000,
  120,
  (SELECT id FROM public.service_categories WHERE name = 'training'),
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  4.8,
  145,
  true
);

-- Insert product categories
INSERT INTO public.product_categories (name, description, active) VALUES
('food', 'Premium pet food and treats', true),
('accessories', 'Pet accessories, toys, and supplies', true),
('health', 'Health and wellness products', true),
('grooming', 'Grooming tools and supplies', true)
ON CONFLICT (name) DO NOTHING;

-- Insert products
INSERT INTO public.products (name, description, price, category_id, brand, weight, size, image_url, rating, total_reviews, in_stock) VALUES
(
  'Premium Dog Food - Royal Canin Adult',
  'High-quality nutrition for adult dogs with balanced protein and vitamins. Made with natural ingredients for optimal health.',
  2850,
  (SELECT id FROM public.product_categories WHERE name = 'food'),
  'Royal Canin',
  '3kg',
  'Large',
  'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
  4.7,
  234,
  true
),
(
  'Cat Food - Whiskas Ocean Fish',
  'Delicious ocean fish flavored cat food with essential nutrients. Complete and balanced nutrition for adult cats.',
  1850,
  (SELECT id FROM public.product_categories WHERE name = 'food'),
  'Whiskas',
  '2kg',
  'Medium',
  'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
  4.5,
  189,
  true
),
(
  'Orthopedic Pet Bed',
  'Memory foam pet bed designed for joint support and comfort. Perfect for senior pets or those with mobility issues.',
  4500,
  (SELECT id FROM public.product_categories WHERE name = 'accessories'),
  'PetComfort',
  NULL,
  'Large',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  4.8,
  156,
  true
),
(
  'Interactive Dog Toy',
  'Mental stimulation toy with treat dispensing feature. Keeps your dog engaged and mentally active.',
  1250,
  (SELECT id FROM public.product_categories WHERE name = 'accessories'),
  'PetPlay',
  NULL,
  'Medium',
  'https://images.unsplash.com/photo-1605557290637-8ce1b4b91ce9?w=400',
  4.6,
  98,
  true
),
(
  'Premium Cat Litter',
  'Clumping clay litter with odor control. Dust-free formula that is safe for cats and easy to clean.',
  950,
  (SELECT id FROM public.product_categories WHERE name = 'accessories'),
  'CleanPaws',
  '5kg',
  'Large',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  4.4,
  267,
  true
),
(
  'Dog Leash and Collar Set',
  'Durable nylon leash and matching collar set. Available in multiple colors and sizes for all dog breeds.',
  1680,
  (SELECT id FROM public.product_categories WHERE name = 'accessories'),
  'PetEssentials',
  NULL,
  'Medium',
  'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400',
  4.6,
  124,
  true
),
(
  'Pet Vitamins - Multivitamin',
  'Complete daily multivitamin for dogs and cats. Supports immune system, coat health, and overall wellness.',
  2200,
  (SELECT id FROM public.product_categories WHERE name = 'health'),
  'VitaPet',
  '90 tablets',
  'Small',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
  4.7,
  156,
  true
),
(
  'Professional Grooming Kit',
  'Complete grooming kit including brushes, nail clippers, and shampoo. Everything you need for at-home grooming.',
  3200,
  (SELECT id FROM public.product_categories WHERE name = 'grooming'),
  'GroomPro',
  NULL,
  'Large',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  4.5,
  89,
  true
),
(
  'Cat Scratching Post',
  'Tall sisal scratching post with multiple levels. Helps keep cats claws healthy and protects furniture.',
  2850,
  (SELECT id FROM public.product_categories WHERE name = 'accessories'),
  'CatTower',
  NULL,
  'Large',
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400',
  4.8,
  178,
  true
),
(
  'Dog Training Treats',
  'Small, soft training treats perfect for positive reinforcement. Made with natural ingredients and irresistible flavor.',
  850,
  (SELECT id FROM public.product_categories WHERE name = 'food'),
  'TreatTime',
  '500g',
  'Small',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  4.6,
  234,
  true
);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;