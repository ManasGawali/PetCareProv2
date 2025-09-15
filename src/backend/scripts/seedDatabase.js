const { 
  User, 
  Service, 
  ServiceProvider, 
  Product,
  sequelize 
} = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding PetCare Pro database...');

    // Create demo users
    const users = await User.bulkCreate([
      {
        email: 'demo@petcarepro.com',
        password: 'demo123',
        full_name: 'Demo User',
        phone: '+91-9876543210',
        address: '123 Demo Street, Demo City',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip_code: '400001',
        is_verified: true
      },
      {
        email: 'jane.doe@email.com',
        password: 'password123',
        full_name: 'Jane Doe',
        phone: '+91-9876543211',
        address: '456 Main Street, Central Area',
        city: 'Delhi',
        state: 'Delhi',
        zip_code: '110001',
        is_verified: true
      },
      {
        email: 'john.smith@email.com',
        password: 'mypassword',
        full_name: 'John Smith',
        phone: '+91-9876543212',
        address: '789 Park Avenue, Garden District',
        city: 'Bangalore',
        state: 'Karnataka',
        zip_code: '560001',
        is_verified: true
      }
    ]);

    console.log('✅ Demo users created');

    // Create service providers
    const providers = await ServiceProvider.bulkCreate([
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@petcarepro.com',
        phone: '+91-8765432101',
        bio: 'Certified pet groomer with 5 years of experience specializing in all breeds.',
        experience_years: 5,
        specializations: ['grooming', 'spa'],
        certifications: ['Certified Pet Groomer', 'Animal First Aid'],
        service_areas: ['Mumbai', 'Navi Mumbai'],
        background_check_verified: true,
        insurance_verified: true,
        is_verified: true,
        average_rating: 4.8,
        total_reviews: 156,
        completed_bookings: 200,
        hourly_rate: 800.00
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@petcarepro.com',
        phone: '+91-8765432102',
        bio: 'Professional dog walker and pet sitter with expertise in behavioral training.',
        experience_years: 3,
        specializations: ['walking', 'sitting', 'training'],
        certifications: ['Pet Care Professional', 'Dog Training Certificate'],
        service_areas: ['Delhi', 'Gurgaon', 'Noida'],
        background_check_verified: true,
        insurance_verified: true,
        is_verified: true,
        average_rating: 4.6,
        total_reviews: 89,
        completed_bookings: 120,
        hourly_rate: 600.00
      }
    ]);

    console.log('✅ Service providers created');

    // Create services
    const services = await Service.bulkCreate([
      {
        name: 'Premium Pet Grooming',
        description: 'Complete grooming service including bath, brush, nail trim, ear cleaning, and styling.',
        category: 'grooming',
        subcategory: 'full_grooming',
        base_price: 1200.00,
        duration_minutes: 120,
        pet_types: ['dog', 'cat'],
        features: ['Bath & Shampoo', 'Nail Trimming', 'Ear Cleaning', 'Teeth Brushing', 'Styling'],
        requirements: ['Up-to-date vaccinations', 'Flea-free pet'],
        average_rating: 4.7,
        total_reviews: 234,
        booking_count: 450
      },
      {
        name: 'Dog Walking Service',
        description: 'Professional dog walking with exercise, socialization, and basic training.',
        category: 'walking',
        subcategory: 'daily_walks',
        base_price: 400.00,
        duration_minutes: 60,
        pet_types: ['dog'],
        features: ['Exercise', 'Socialization', 'GPS Tracking', 'Photo Updates'],
        requirements: ['Leash trained', 'Current vaccinations'],
        average_rating: 4.5,
        total_reviews: 178,
        booking_count: 650
      },
      {
        name: 'Pet Sitting & Care',
        description: 'In-home pet sitting with feeding, playtime, and companionship.',
        category: 'sitting',
        subcategory: 'home_sitting',
        base_price: 800.00,
        duration_minutes: 240,
        pet_types: ['dog', 'cat', 'bird', 'rabbit'],
        features: ['Feeding', 'Playtime', 'Medication Administration', 'House Security'],
        requirements: ['Pet-proofed home', 'Emergency contact'],
        average_rating: 4.8,
        total_reviews: 92,
        booking_count: 180
      },
      {
        name: 'Basic Pet Training',
        description: 'Fundamental obedience training for pets with positive reinforcement.',
        category: 'training',
        subcategory: 'obedience',
        base_price: 1500.00,
        duration_minutes: 90,
        pet_types: ['dog', 'cat'],
        features: ['Basic Commands', 'Leash Training', 'House Training', 'Behavioral Correction'],
        requirements: ['Pet age 3+ months', 'Vaccination records'],
        average_rating: 4.6,
        total_reviews: 67,
        booking_count: 95
      },
      {
        name: 'Mobile Veterinary Visit',
        description: 'Professional veterinary consultation and basic health check at your home.',
        category: 'veterinary',
        subcategory: 'consultation',
        base_price: 2000.00,
        duration_minutes: 45,
        pet_types: ['dog', 'cat', 'bird', 'rabbit'],
        features: ['Health Examination', 'Vaccination', 'Basic Treatment', 'Health Certificate'],
        requirements: ['Pet medical history', 'Previous vaccination records'],
        average_rating: 4.9,
        total_reviews: 134,
        booking_count: 220
      },
      {
        name: 'Spa & Wellness Treatment',
        description: 'Relaxing spa treatment with aromatherapy, massage, and premium products.',
        category: 'spa',
        subcategory: 'wellness',
        base_price: 1800.00,
        duration_minutes: 150,
        pet_types: ['dog', 'cat'],
        features: ['Aromatherapy Bath', 'Massage Therapy', 'Nail Polish', 'Premium Products'],
        requirements: ['Calm temperament', 'No skin allergies'],
        average_rating: 4.7,
        total_reviews: 56,
        booking_count: 78
      }
    ]);

    console.log('✅ Services created');

    // Create products
    const products = await Product.bulkCreate([
      {
        name: 'Premium Dog Food - Chicken & Rice',
        description: 'High-quality dry dog food made with real chicken and brown rice for adult dogs.',
        category: 'food',
        subcategory: 'dry_food',
        brand: 'PetCare Pro',
        sku: 'FOO001',
        price: 2499.00,
        original_price: 2999.00,
        weight: 15.0,
        weight_unit: 'kg',
        pet_types: ['dog'],
        pet_sizes: ['medium', 'large'],
        age_range: ['adult'],
        ingredients: 'Chicken, Brown Rice, Vegetables, Vitamins, Minerals',
        stock_quantity: 150,
        is_available: true,
        is_featured: true,
        average_rating: 4.6,
        review_count: 89,
        discount_percentage: 16.67
      },
      {
        name: 'Interactive Puzzle Toy',
        description: 'Mental stimulation puzzle toy that dispenses treats to keep pets engaged.',
        category: 'toys',
        subcategory: 'puzzle',
        brand: 'SmartPet',
        sku: 'TOY001',
        price: 1299.00,
        weight: 0.8,
        weight_unit: 'kg',
        pet_types: ['dog', 'cat'],
        pet_sizes: ['small', 'medium', 'large'],
        age_range: ['puppy', 'adult'],
        stock_quantity: 75,
        is_available: true,
        average_rating: 4.4,
        review_count: 45,
        tags: ['interactive', 'mental_stimulation', 'treat_dispenser']
      },
      {
        name: 'Luxury Pet Bed - Orthopedic',
        description: 'Premium orthopedic pet bed with memory foam for maximum comfort and joint support.',
        category: 'beds',
        subcategory: 'orthopedic',
        brand: 'ComfortPet',
        sku: 'BED001',
        price: 3999.00,
        weight: 2.5,
        weight_unit: 'kg',
        dimensions: { length: 80, width: 60, height: 15 },
        pet_types: ['dog', 'cat'],
        pet_sizes: ['medium', 'large'],
        stock_quantity: 25,
        is_available: true,
        is_featured: true,
        average_rating: 4.8,
        review_count: 62
      },
      {
        name: 'Natural Dental Chews',
        description: 'All-natural dental chews that help clean teeth and freshen breath.',
        category: 'treats',
        subcategory: 'dental',
        brand: 'HealthyBite',
        sku: 'TRE001',
        price: 599.00,
        weight: 0.5,
        weight_unit: 'kg',
        pet_types: ['dog'],
        pet_sizes: ['small', 'medium', 'large'],
        age_range: ['adult'],
        ingredients: 'Sweet Potato, Chicken, Natural Flavoring',
        stock_quantity: 200,
        is_available: true,
        average_rating: 4.3,
        review_count: 127,
        tags: ['natural', 'dental_health', 'grain_free']
      },
      {
        name: 'Professional Grooming Kit',
        description: 'Complete grooming kit with brushes, nail clippers, and shampoo for home grooming.',
        category: 'grooming',
        subcategory: 'tools',
        brand: 'GroomPro',
        sku: 'GRO001',
        price: 1899.00,
        weight: 1.2,
        weight_unit: 'kg',
        pet_types: ['dog', 'cat'],
        stock_quantity: 40,
        is_available: true,
        average_rating: 4.5,
        review_count: 38,
        tags: ['professional', 'complete_kit', 'home_grooming']
      },
      {
        name: 'Cat Litter - Clumping Clay',
        description: 'Premium clumping clay litter with odor control and dust-free formula.',
        category: 'accessories',
        subcategory: 'litter',
        brand: 'CleanPaws',
        sku: 'ACC001',
        price: 899.00,
        weight: 10.0,
        weight_unit: 'kg',
        pet_types: ['cat'],
        stock_quantity: 80,
        is_available: true,
        average_rating: 4.2,
        review_count: 94,
        tags: ['clumping', 'odor_control', 'dust_free']
      }
    ]);

    console.log('✅ Products created');

    console.log('🎉 Database seeding completed successfully!');
    
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Service Providers: ${providers.length}`);
    console.log(`   Services: ${services.length}`);
    console.log(`   Products: ${products.length}`);
    
    console.log('\n🔐 Demo Login Credentials:');
    console.log('   Email: demo@petcarepro.com | Password: demo123');
    console.log('   Email: jane.doe@email.com | Password: password123');
    console.log('   Email: john.smith@email.com | Password: mypassword');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();