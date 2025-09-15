import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.address.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const hashedPassword2 = await bcrypt.hash('password123', 10);
  const hashedPassword3 = await bcrypt.hash('mypassword', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@petcarepro.com',
      password: hashedPassword,
      fullName: 'Demo User',
      phone: '+91 9876543210',
      verified: true,
    },
  });

  const janeUser = await prisma.user.create({
    data: {
      email: 'jane.doe@email.com',
      password: hashedPassword2,
      fullName: 'Jane Doe',
      phone: '+91 9876543211',
      verified: true,
    },
  });

  const johnUser = await prisma.user.create({
    data: {
      email: 'john.smith@email.com',
      password: hashedPassword3,
      fullName: 'John Smith',
      phone: '+91 9876543212',
      verified: true,
    },
  });

  console.log('✅ Created demo users');

  // Create pets for demo user
  const pets = await prisma.pet.createMany({
    data: [
      {
        name: 'Buddy',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        weight: 25.5,
        specialNotes: 'Friendly and energetic, loves treats',
        userId: demoUser.id,
      },
      {
        name: 'Whiskers',
        type: 'Cat',
        breed: 'Persian',
        age: 2,
        weight: 4.2,
        specialNotes: 'Shy but gentle, prefers quiet environments',
        userId: demoUser.id,
      },
      {
        name: 'Charlie',
        type: 'Dog',
        breed: 'Labrador',
        age: 5,
        weight: 30.0,
        userId: janeUser.id,
      },
    ],
  });

  console.log('✅ Created demo pets');

  // Create addresses
  await prisma.address.createMany({
    data: [
      {
        type: 'HOME',
        street: '123 Pet Lover Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        isDefault: true,
        userId: demoUser.id,
      },
      {
        type: 'WORK',
        street: '456 Business Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400002',
        userId: demoUser.id,
      },
    ],
  });

  console.log('✅ Created addresses');

  // Create services
  const services = await prisma.service.createMany({
    data: [
      // Grooming Services
      {
        name: 'Premium Pet Grooming',
        category: 'GROOMING',
        description: 'Complete grooming service including bath, nail trimming, hair cut, and styling. Professional grooming for all pet sizes.',
        price: 1500.00,
        duration: 120,
        imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400'
      },
      {
        name: 'Basic Pet Bath',
        category: 'GROOMING',
        description: 'Essential bath service with pet-safe shampoo, drying, and basic brushing. Perfect for regular maintenance.',
        price: 800.00,
        duration: 60,
        imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
      },

      // Walking Services
      {
        name: 'Daily Dog Walking',
        category: 'WALKING',
        description: 'Professional dog walking service for 30-45 minutes. Includes exercise, socialization, and basic training.',
        price: 500.00,
        duration: 45,
        imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'
      },
      {
        name: 'Group Dog Walking',
        category: 'WALKING',
        description: 'Socialized group walking for friendly dogs. Great for social pets who enjoy company.',
        price: 350.00,
        duration: 60,
        imageUrl: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400'
      },

      // Pet Sitting
      {
        name: 'In-Home Pet Sitting',
        category: 'SITTING',
        description: 'Comprehensive pet sitting in your home. Includes feeding, playtime, and companionship.',
        price: 1200.00,
        duration: 480,
        imageUrl: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400'
      },
      {
        name: 'Pet Daycare Service',
        category: 'SITTING',
        description: 'Full-day pet care at our facility. Supervised play, feeding, and rest time.',
        price: 2000.00,
        duration: 600,
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400'
      },

      // Training Services
      {
        name: 'Basic Obedience Training',
        category: 'TRAINING',
        description: 'Fundamental training covering sit, stay, come, and leash walking. Perfect for puppies and new pets.',
        price: 2500.00,
        duration: 90,
        imageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400'
      },
      {
        name: 'Advanced Behavioral Training',
        category: 'TRAINING',
        description: 'Specialized training for behavioral issues, anxiety, and advanced commands. One-on-one sessions.',
        price: 3500.00,
        duration: 120,
        imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400'
      },

      // Veterinary Services
      {
        name: 'Health Check-up',
        category: 'VETERINARY',
        description: 'Complete health examination including weight check, temperature, and general wellness assessment.',
        price: 1000.00,
        duration: 45,
        imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400'
      },
      {
        name: 'Vaccination Service',
        category: 'VETERINARY',
        description: 'Professional vaccination service at your home. Includes consultation and vaccination records.',
        price: 1800.00,
        duration: 30,
        imageUrl: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400'
      },

      // Bath & Spa
      {
        name: 'Luxury Spa Treatment',
        category: 'BATH_SPA',
        description: 'Premium spa experience with aromatherapy bath, massage, nail care, and relaxation therapy.',
        price: 2800.00,
        duration: 150,
        imageUrl: 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400'
      },
      {
        name: 'Therapeutic Bath',
        category: 'BATH_SPA',
        description: 'Medicated bath for pets with skin conditions. Includes special shampoos and conditioning treatments.',
        price: 1500.00,
        duration: 90,
        imageUrl: 'https://images.unsplash.com/photo-1520087619250-584dc4d7c161?w=400'
      }
    ],
  });

  console.log('✅ Created services');

  // Create products
  await prisma.product.createMany({
    data: [
      // Pet Food
      {
        name: 'Royal Canin Adult Dog Food',
        category: 'FOOD',
        description: 'Premium nutrition for adult dogs. Complete and balanced diet with high-quality proteins.',
        price: 2500.00,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'
      },
      {
        name: 'Whiskas Cat Food Variety Pack',
        category: 'FOOD',
        description: 'Delicious variety pack for cats with different flavors. Rich in proteins and essential nutrients.',
        price: 1800.00,
        stock: 75,
        imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400'
      },
      {
        name: 'Puppy Starter Kit Food',
        category: 'FOOD',
        description: 'Specially formulated nutrition for puppies up to 12 months. Supports healthy growth and development.',
        price: 2200.00,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400'
      },

      // Accessories
      {
        name: 'Premium Leather Dog Collar',
        category: 'ACCESSORIES',
        description: 'Handcrafted leather collar with adjustable fit. Durable and comfortable for daily wear.',
        price: 1200.00,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
      },
      {
        name: 'Retractable Dog Leash',
        category: 'ACCESSORIES',
        description: 'Heavy-duty retractable leash with 5-meter range. Perfect for walks and training sessions.',
        price: 800.00,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'
      },
      {
        name: 'Cozy Pet Bed',
        category: 'ACCESSORIES',
        description: 'Ultra-soft and comfortable pet bed with washable cover. Available in multiple sizes.',
        price: 2000.00,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400'
      },

      // Toys
      {
        name: 'Interactive Puzzle Toy',
        category: 'TOYS',
        description: 'Mental stimulation toy that challenges pets and provides hours of entertainment.',
        price: 1500.00,
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400'
      },
      {
        name: 'Rope Tug Toy Set',
        category: 'TOYS',
        description: 'Durable rope toys perfect for tug-of-war and chewing. Set of 3 different sizes.',
        price: 600.00,
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400'
      },

      // Health Products
      {
        name: 'Pet Multivitamin Supplements',
        category: 'HEALTH',
        description: 'Essential vitamins and minerals for optimal pet health. Veterinarian recommended.',
        price: 1800.00,
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400'
      },
      {
        name: 'Dental Care Kit',
        category: 'HEALTH',
        description: 'Complete dental care solution including toothbrush, toothpaste, and dental treats.',
        price: 1200.00,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400'
      }
    ],
  });

  console.log('✅ Created products');

  // Create some sample bookings
  const petsList = await prisma.pet.findMany();
  const servicesList = await prisma.service.findMany();

  if (petsList.length > 0 && servicesList.length > 0) {
    await prisma.booking.createMany({
      data: [
        {
          userId: demoUser.id,
          petId: petsList[0].id,
          serviceId: servicesList[0].id,
          status: 'COMPLETED',
          scheduledAt: new Date('2024-12-15T10:00:00Z'),
          completedAt: new Date('2024-12-15T12:00:00Z'),
          totalPrice: servicesList[0].price,
          notes: 'First grooming session went great!',
          address: '123 Pet Lover Street, Mumbai, Maharashtra 400001',
          phone: '+91 9876543210',
        },
        {
          userId: demoUser.id,
          petId: petsList[1].id,
          serviceId: servicesList[2].id,
          status: 'CONFIRMED',
          scheduledAt: new Date('2025-01-20T09:00:00Z'),
          totalPrice: servicesList[2].price,
          notes: 'Regular walking service for Whiskers',
          address: '123 Pet Lover Street, Mumbai, Maharashtra 400001',
          phone: '+91 9876543210',
        },
      ],
    });

    console.log('✅ Created sample bookings');
  }

  // Add some items to cart
  const productsList = await prisma.product.findMany();
  if (productsList.length > 0) {
    await prisma.cartItem.createMany({
      data: [
        {
          userId: demoUser.id,
          productId: productsList[0].id,
          quantity: 2,
        },
        {
          userId: demoUser.id,
          productId: productsList[3].id,
          quantity: 1,
        },
      ],
    });

    console.log('✅ Added items to cart');
  }

  console.log('🎉 Database seed completed successfully!');
  console.log('Demo Users Created:');
  console.log('  📧 demo@petcarepro.com / demo123');
  console.log('  📧 jane.doe@email.com / password123');
  console.log('  📧 john.smith@email.com / mypassword');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });