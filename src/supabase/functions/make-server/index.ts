import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase clients
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
);

// Helper function to verify user authentication
const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    throw new Error('Invalid or expired token');
  }
  
  return user;
};

// Database utilities
const transformService = (service: any) => ({
  id: service.id,
  name: service.name,
  description: service.description,
  price: service.price,
  duration: service.duration,
  category: service.service_categories?.name || 'general',
  image: service.image_url,
  rating: parseFloat(service.rating) || 0,
  reviews: service.total_reviews || 0
});

const transformProduct = (product: any) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  category: product.product_categories?.name || 'general',
  brand: product.brand,
  weight: product.weight,
  size: product.size,
  image: product.image_url,
  rating: parseFloat(product.rating) || 0,
  reviews: product.total_reviews || 0,
  inStock: product.in_stock
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Authentication endpoints
app.post("/auth/signup", async (c) => {
  try {
    const { email, password, full_name } = await c.req.json();
    
    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name },
      email_confirm: true // Auto-confirm for demo
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ success: false, message: error.message }, 400);
    }

    return c.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name,
          avatar_url: null,
          provider: 'email'
        }
      }
    });
  } catch (error) {
    console.error('Signup endpoint error:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

app.post("/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Signin error:', error);
      return c.json({ success: false, message: error.message }, 400);
    }

    // Get user data from database
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    return c.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: userData?.full_name || data.user.user_metadata?.full_name || '',
          avatar_url: data.user.user_metadata?.avatar_url || null,
          provider: 'email'
        },
        session: data.session
      }
    });
  } catch (error) {
    console.error('Signin endpoint error:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

app.get("/auth/user", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    
    // Get user data from database
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: userData?.full_name || user.user_metadata?.full_name || '',
          avatar_url: userData?.avatar_url || user.user_metadata?.avatar_url || null,
          provider: 'email'
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ success: false, message: 'Unauthorized' }, 401);
  }
});

// Services endpoints
app.get("/services", async (c) => {
  try {
    const { data: services, error } = await supabaseAdmin
      .from('services')
      .select(`
        *,
        service_categories(name)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get services error:', error);
      return c.json({ success: false, message: 'Failed to fetch services' }, 500);
    }

    const transformedServices = services?.map(transformService) || [];
    return c.json({ success: true, data: transformedServices });
  } catch (error) {
    console.error('Get services error:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

app.get("/services/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data: service, error } = await supabaseAdmin
      .from('services')
      .select(`
        *,
        service_categories(name)
      `)
      .eq('id', id)
      .eq('active', true)
      .single();
    
    if (error || !service) {
      return c.json({ success: false, message: 'Service not found' }, 404);
    }
    
    return c.json({ success: true, data: transformService(service) });
  } catch (error) {
    console.error('Get service error:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Products endpoints
app.get("/products", async (c) => {
  try {
    const category = c.req.query('category');
    
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        product_categories(name)
      `)
      .eq('in_stock', true)
      .order('created_at', { ascending: false });
    
    // Filter by category if provided
    if (category) {
      query = query.eq('product_categories.name', category);
    }
    
    const { data: products, error } = await query;

    if (error) {
      console.error('Get products error:', error);
      return c.json({ success: false, message: 'Failed to fetch products' }, 500);
    }

    const transformedProducts = products?.map(transformProduct) || [];
    return c.json({ success: true, data: transformedProducts });
  } catch (error) {
    console.error('Get products error:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

app.get("/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_categories(name)
      `)
      .eq('id', id)
      .eq('in_stock', true)
      .single();
    
    if (error || !product) {
      return c.json({ success: false, message: 'Product not found' }, 404);
    }
    
    return c.json({ success: true, data: transformProduct(product) });
  } catch (error) {
    console.error('Get product error:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Bookings endpoints
app.post("/bookings", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const bookingData = await c.req.json();
    
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: user.id,
        service_id: bookingData.service_id,
        pet_id: bookingData.pet_id,
        scheduled_at: bookingData.scheduled_at,
        price: bookingData.price,
        notes: bookingData.notes,
        address: bookingData.address,
        status: 'confirmed'
      })
      .select(`
        *,
        services(name, description, image_url),
        pets(name, species)
      `)
      .single();
    
    if (error) {
      console.error('Create booking error:', error);
      return c.json({ success: false, message: 'Failed to create booking' }, 500);
    }
    
    return c.json({ success: true, data: booking });
  } catch (error) {
    console.error('Create booking error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.get("/bookings/user", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        services(name, description, image_url),
        pets(name, species)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get user bookings error:', error);
      return c.json({ success: false, message: 'Failed to fetch bookings' }, 500);
    }
    
    return c.json({ success: true, data: bookings || [] });
  } catch (error) {
    console.error('Get user bookings error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.get("/bookings/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const bookingId = c.req.param('id');
    
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        services(name, description, image_url),
        pets(name, species)
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();
    
    if (error || !booking) {
      return c.json({ success: false, message: 'Booking not found' }, 404);
    }
    
    return c.json({ success: true, data: booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.put("/bookings/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const bookingId = c.req.param('id');
    const updateData = await c.req.json();
    
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .select(`
        *,
        services(name, description, image_url),
        pets(name, species)
      `)
      .single();
    
    if (error) {
      console.error('Update booking error:', error);
      return c.json({ success: false, message: 'Failed to update booking' }, 500);
    }
    
    return c.json({ success: true, data: booking });
  } catch (error) {
    console.error('Update booking error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

// Pets endpoints
app.get("/pets", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    
    const { data: pets, error } = await supabaseAdmin
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get pets error:', error);
      return c.json({ success: false, message: 'Failed to fetch pets' }, 500);
    }
    
    return c.json({ success: true, data: pets || [] });
  } catch (error) {
    console.error('Get pets error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.post("/pets", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const petData = await c.req.json();
    
    const { data: pet, error } = await supabaseAdmin
      .from('pets')
      .insert({
        user_id: user.id,
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        age: petData.age,
        weight: petData.weight,
        medical_notes: petData.medical_notes,
        photo_url: petData.photo_url
      })
      .select()
      .single();
    
    if (error) {
      console.error('Create pet error:', error);
      return c.json({ success: false, message: 'Failed to create pet profile' }, 500);
    }
    
    return c.json({ success: true, data: pet });
  } catch (error) {
    console.error('Create pet error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

// Cart endpoints
app.get("/cart", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    
    const { data: cartItems, error } = await supabaseAdmin
      .from('cart_items')
      .select(`
        *,
        products(
          *,
          product_categories(name)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get cart error:', error);
      return c.json({ success: false, message: 'Failed to fetch cart' }, 500);
    }
    
    return c.json({ success: true, data: cartItems || [] });
  } catch (error) {
    console.error('Get cart error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.post("/cart/items", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const { product_id, quantity = 1 } = await c.req.json();
    
    // Check if product exists
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', product_id)
      .eq('in_stock', true)
      .single();
    
    if (productError || !product) {
      return c.json({ success: false, message: 'Product not found or out of stock' }, 404);
    }
    
    // Upsert cart item (insert or update if exists)
    const { data: cartItem, error } = await supabaseAdmin
      .from('cart_items')
      .upsert({
        user_id: user.id,
        product_id,
        quantity
      }, {
        onConflict: 'user_id,product_id'
      })
      .select(`
        *,
        products(
          *,
          product_categories(name)
        )
      `)
      .single();
    
    if (error) {
      console.error('Add to cart error:', error);
      return c.json({ success: false, message: 'Failed to add item to cart' }, 500);
    }
    
    return c.json({ success: true, data: cartItem });
  } catch (error) {
    console.error('Add to cart error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.put("/cart/items/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const itemId = c.req.param('id');
    const { quantity } = await c.req.json();
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      const { error } = await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Remove cart item error:', error);
        return c.json({ success: false, message: 'Failed to remove item' }, 500);
      }
      
      return c.json({ success: true, data: null });
    } else {
      // Update quantity
      const { data: cartItem, error } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id)
        .select(`
          *,
          products(
            *,
            product_categories(name)
          )
        `)
        .single();
      
      if (error) {
        console.error('Update cart item error:', error);
        return c.json({ success: false, message: 'Failed to update item' }, 500);
      }
      
      return c.json({ success: true, data: cartItem });
    }
  } catch (error) {
    console.error('Update cart item error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.delete("/cart/items/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const itemId = c.req.param('id');
    
    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Remove cart item error:', error);
      return c.json({ success: false, message: 'Failed to remove item' }, 500);
    }
    
    return c.json({ success: true, data: null });
  } catch (error) {
    console.error('Remove cart item error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.delete("/cart/clear", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    
    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Clear cart error:', error);
      return c.json({ success: false, message: 'Failed to clear cart' }, 500);
    }
    
    return c.json({ success: true, data: [] });
  } catch (error) {
    console.error('Clear cart error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

// Orders endpoints
app.post("/orders", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const orderData = await c.req.json();
    
    // Create order and order items in a transaction
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        notes: orderData.notes
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Create order error:', orderError);
      return c.json({ success: false, message: 'Failed to create order' }, 500);
    }
    
    // Add order items
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.error('Create order items error:', itemsError);
        // Cleanup - delete the order if items failed
        await supabaseAdmin.from('orders').delete().eq('id', order.id);
        return c.json({ success: false, message: 'Failed to create order items' }, 500);
      }
    }
    
    // Clear user's cart
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    
    return c.json({ success: true, data: order });
  } catch (error) {
    console.error('Create order error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.get("/orders/user", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(name, image_url)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get user orders error:', error);
      return c.json({ success: false, message: 'Failed to fetch orders' }, 500);
    }
    
    return c.json({ success: true, data: orders || [] });
  } catch (error) {
    console.error('Get user orders error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

// Reviews endpoints
app.post("/reviews", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    const reviewData = await c.req.json();
    
    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        user_id: user.id,
        booking_id: reviewData.booking_id,
        service_id: reviewData.service_id,
        product_id: reviewData.product_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      .select(`
        *,
        users(full_name),
        services(name),
        products(name)
      `)
      .single();
    
    if (error) {
      console.error('Create review error:', error);
      return c.json({ success: false, message: 'Failed to create review' }, 500);
    }
    
    return c.json({ success: true, data: review });
  } catch (error) {
    console.error('Create review error:', error);
    return c.json({ success: false, message: error.message || 'Internal server error' }, 500);
  }
});

app.get("/reviews/service/:serviceId", async (c) => {
  try {
    const serviceId = c.req.param('serviceId');
    
    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        users(full_name)
      `)
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get service reviews error:', error);
      return c.json({ success: false, message: 'Failed to fetch reviews' }, 500);
    }
    
    return c.json({ success: true, data: reviews || [] });
  } catch (error) {
    console.error('Get service reviews error:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);