import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { Readable } from 'node:stream';
import app from '../app.js';

/**
 * In-memory HTTP request dispatcher for Express applications.
 * Runs directly in process without opening TCP sockets.
 */
function request(app, { method = 'GET', path = '/', headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const socket = new Readable({ read() {} });
    const req = new http.IncomingMessage(socket);
    req.method = method.toUpperCase();
    req.url = path;

    const payload = body !== null ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;

    req.headers = {
      host: 'localhost',
      ...(payload ? {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload),
      } : {}),
      ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])),
    };

    const res = new http.ServerResponse(req);
    let raw = '';

    res.write = (chunk) => {
      raw += chunk ? chunk.toString() : '';
      return true;
    };

    res.end = (chunk) => {
      if (chunk) raw += chunk.toString();
      let json = null;
      try {
        json = JSON.parse(raw);
      } catch {
        json = null;
      }
      resolve({
        status: res.statusCode,
        headers: res.getHeaders(),
        body: json !== null ? json : raw,
        text: raw,
      });
    };

    res.on('error', reject);
    req.on('error', reject);

    app(req, res);

    if (payload) {
      req.push(payload);
      req.push(null);
    } else {
      req.push(null);
    }
  });
}

// Ephemeral test accounts
const testFarmer = {
  name: 'Kisan Test Farmer',
  email: `farmer_${Date.now()}@testkisan.com`,
  password: 'Password@123',
  role: 'farmer',
  location: 'Punjab Mandi',
  phone: '+91 98765 00001',
};

const testBuyer = {
  name: 'Aditi Consumer',
  email: `buyer_${Date.now()}@testkisan.com`,
  password: 'Password@123',
  role: 'buyer',
  location: 'Delhi NCR',
  phone: '+91 98765 00002',
};

let farmerToken = '';
let buyerToken = '';
let createdProductId = '';
let createdOrderId = '';

/* ==========================================================================
   1. System & Health Endpoint Tests
   ========================================================================== */
describe('1. System & Health Endpoints', () => {
  test('GET / returns API index and welcome message', async () => {
    const res = await request(app, { path: '/' });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.message.includes('Kisan Market API'));
    assert.strictEqual(res.body.healthCheck, '/api/health');
    assert.strictEqual(res.body.productsEndpoint, '/api/products');
  });

  test('GET /api/health returns status ok with server metrics', async () => {
    const res = await request(app, { path: '/api/health' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.strictEqual(res.body.service, 'kisan-market-api');
    assert.ok(typeof res.body.uptime === 'number');
    assert.ok(res.body.timestamp);
    assert.ok(res.body.database);
  });

  test('GET /api/unknown-route returns 404 JSON', async () => {
    const res = await request(app, { path: '/api/route-that-does-not-exist' });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('not found'));
  });
});

/* ==========================================================================
   2. Authentication & Authorization Tests (/api/auth)
   ========================================================================== */
describe('2. Authentication & Authorization (/api/auth)', () => {
  test('POST /api/auth/register creates a farmer and returns JWT token', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/auth/register',
      body: testFarmer,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token, 'Should return JWT token');
    assert.strictEqual(res.body.user.email, testFarmer.email.toLowerCase());
    assert.strictEqual(res.body.user.role, 'farmer');
    farmerToken = res.body.token;
  });

  test('POST /api/auth/register creates a buyer and returns JWT token', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/auth/register',
      body: testBuyer,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'buyer');
    buyerToken = res.body.token;
  });

  test('POST /api/auth/register rejects duplicate email with 400', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/auth/register',
      body: testFarmer,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('already exists'));
  });

  test('POST /api/auth/register rejects missing required fields with 400', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/auth/register',
      body: { email: 'incomplete@test.com' },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('name, email, and password'));
  });

  test('POST /api/auth/register rejects short passwords with 400', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Short Pass User',
        email: `short_${Date.now()}@test.com`,
        password: '123',
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('at least 6 characters'));
  });

  test('POST /api/auth/login succeeds with valid credentials', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: testFarmer.email,
        password: testFarmer.password,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, testFarmer.email.toLowerCase());
  });

  test('POST /api/auth/login rejects incorrect password with 401', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: testFarmer.email,
        password: 'wrong_password_123',
      },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Invalid email or password'));
  });

  test('POST /api/auth/login rejects non-existent email with 401', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: 'nobody_exists_here_9999@test.com',
        password: 'any_password',
      },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  test('GET /api/auth/me returns current user profile with valid Bearer token', async () => {
    const res = await request(app, {
      path: '/api/auth/me',
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.email, testFarmer.email.toLowerCase());
    assert.strictEqual(res.body.user.role, 'farmer');
  });

  test('GET /api/auth/me rejects request without token with 401', async () => {
    const res = await request(app, { path: '/api/auth/me' });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('no token provided'));
  });

  test('GET /api/auth/me rejects request with invalid/corrupt token with 401', async () => {
    const res = await request(app, {
      path: '/api/auth/me',
      headers: { Authorization: 'Bearer this_is_not_a_valid_jwt' },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('token invalid'));
  });
});

/* ==========================================================================
   3. Product CRUD & Filtering Tests (/api/products)
   ========================================================================== */
describe('3. Product CRUD & Filtering (/api/products)', () => {
  test('GET /api/products returns product array with count', async () => {
    const res = await request(app, { path: '/api/products' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.count >= 1);
  });

  test('GET /api/products?category=Vegetables filters correctly', async () => {
    const res = await request(app, { path: '/api/products?category=Vegetables' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    for (const item of res.body.data) {
      assert.strictEqual(item.category.toLowerCase(), 'vegetables');
    }
  });

  test('GET /api/products?search=Wheat searches correctly', async () => {
    const res = await request(app, { path: '/api/products?search=Wheat' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.some((item) => item.name.toLowerCase().includes('wheat')));
  });

  test('POST /api/products creates a new produce item', async () => {
    const newCrop = {
      name: 'Shimla Green Capsicum',
      category: 'Vegetables',
      price: 55,
      unit: 'kg',
      stock: 75,
      farmer: testFarmer.name,
      location: 'Himachal Farm',
      description: 'Crisp, greenhouse-grown organic bell peppers.',
    };

    const res = await request(app, {
      method: 'POST',
      path: '/api/products',
      body: newCrop,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'Shimla Green Capsicum');
    assert.strictEqual(res.body.data.price, 55);
    assert.ok(res.body.data.id || res.body.data._id);
    createdProductId = res.body.data.id || res.body.data._id;
  });

  test('POST /api/products rejects missing required fields with 400', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/products',
      body: { name: 'Only Name Given' },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('name, category, and price'));
  });

  test('POST /api/products rejects negative price with 400', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/products',
      body: {
        name: 'Bad Price Crop',
        category: 'Fruits',
        price: -50,
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('positive number'));
  });

  test('GET /api/products/:id retrieves single product', async () => {
    const res = await request(app, { path: `/api/products/${createdProductId}` });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'Shimla Green Capsicum');
  });

  test('GET /api/products/:id returns 404 for unknown ID', async () => {
    const res = await request(app, { path: '/api/products/unknown_id_99999' });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  test('PUT /api/products/:id updates price and stock', async () => {
    const res = await request(app, {
      method: 'PUT',
      path: `/api/products/${createdProductId}`,
      body: {
        price: 65,
        stock: 90,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.price, 65);
    assert.strictEqual(res.body.data.stock, 90);
  });

  test('DELETE /api/products/:id removes product successfully', async () => {
    const res = await request(app, {
      method: 'DELETE',
      path: `/api/products/${createdProductId}`,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    // Verify subsequent lookup yields 404
    const verifyRes = await request(app, { path: `/api/products/${createdProductId}` });
    assert.strictEqual(verifyRes.status, 404);
  });

  test('DELETE /api/products/:id returns 404 for non-existent product', async () => {
    const res = await request(app, {
      method: 'DELETE',
      path: '/api/products/already_deleted_12345',
    });
    assert.strictEqual(res.status, 404);
  });
});

/* ==========================================================================
   4. Orders & Fulfillment Workflow Tests (/api/orders)
   ========================================================================== */
describe('4. Orders & Fulfillment Workflow (/api/orders)', () => {
  test('POST /api/orders places a new order with server total calculation', async () => {
    const orderPayload = {
      buyerName: testBuyer.name,
      buyerPhone: testBuyer.phone,
      deliveryAddress: 'House 55, Green Park, New Delhi 110016',
      items: [
        {
          productId: '1',
          productName: 'Organic Wheat',
          price: 45,
          quantity: 4,
          unit: 'kg',
        },
      ],
    };

    const res = await request(app, {
      method: 'POST',
      path: '/api/orders',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: orderPayload,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id || res.body.data._id);
    assert.strictEqual(res.body.data.status, 'pending');
    assert.strictEqual(res.body.data.totalAmount, 180, '4 * 45 should equal 180');
    createdOrderId = res.body.data.id || res.body.data._id;
  });

  test('POST /api/orders rejects order with empty items array with 400', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/orders',
      body: {
        deliveryAddress: 'Jaipur Mandi',
        items: [],
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('at least one item'));
  });

  test('POST /api/orders rejects order without delivery address with 400', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/api/orders',
      body: {
        items: [{ productId: '1', quantity: 2, price: 45 }],
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('delivery address'));
  });

  test('GET /api/orders/my-orders retrieves buyer order history', async () => {
    const res = await request(app, {
      path: '/api/orders/my-orders',
      headers: { Authorization: `Bearer ${buyerToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  test('GET /api/orders/farmer-orders retrieves orders for farmer fulfillment', async () => {
    const res = await request(app, {
      path: '/api/orders/farmer-orders',
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 1);
  });

  test('PATCH /api/orders/:id/status updates status to confirmed', async () => {
    const res = await request(app, {
      method: 'PATCH',
      path: `/api/orders/${createdOrderId}/status`,
      body: { status: 'confirmed' },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'confirmed');
  });

  test('PATCH /api/orders/:id/status rejects invalid status with 400', async () => {
    const res = await request(app, {
      method: 'PATCH',
      path: `/api/orders/${createdOrderId}/status`,
      body: { status: 'invalid_status_xyz' },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Status must be one of'));
  });

  test('PATCH /api/orders/:id/status returns 404 for non-existent order', async () => {
    const res = await request(app, {
      method: 'PATCH',
      path: '/api/orders/ord_nonexistent_9999/status',
      body: { status: 'delivered' },
    });
    assert.strictEqual(res.status, 404);
  });
});
