const http = require('http');
const app = require('./server');
const mongoose = require('mongoose');

const httpRequest = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

const runDebug = async () => {
  console.log('=== STEP 3: DIRECT DASHBOARD API TEST ===\n');

  // Start server on port 5000 for direct testing
  const PORT = 5000;
  let server;
  try {
    server = await new Promise((resolve, reject) => {
      const s = app.listen(PORT, () => resolve(s));
      s.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${PORT} is already in use, reusing running server...`);
          resolve(null);
        } else {
          reject(err);
        }
      });
    });
  } catch (err) {
    console.error('Server listen error:', err);
  }

  try {
    const timestamp = Date.now();
    const testEmail = `debug_user_${timestamp}@example.com`;

    // Test 1: Register User
    console.log('[Test 1] Registering user:', testEmail);
    const regRes = await httpRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { name: 'Debug Tester', email: testEmail, password: 'password123' });

    console.log('Register Status:', regRes.status);
    console.log('Register Response:', regRes.body);

    if (regRes.status !== 201 || !regRes.body.token) {
      console.error('❌ Registration failed!');
      return;
    }
    const token = regRes.body.token;

    // Test 2: Call Dashboard Stats API with valid token
    console.log('\n[Test 2] Calling GET /api/tasks/stats with valid token...');
    const statsRes = await httpRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks/stats',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Stats HTTP Status:', statsRes.status);
    console.log('Stats Response Body:', JSON.stringify(statsRes.body, null, 2));

    // Test 3: Call Tasks List API with valid token
    console.log('\n[Test 3] Calling GET /api/tasks with valid token...');
    const tasksRes = await httpRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Tasks HTTP Status:', tasksRes.status);
    console.log('Tasks Response Body:', JSON.stringify(tasksRes.body, null, 2));

    // Test 4: Call Stats WITHOUT token (Simulating unauthenticated / expired state)
    console.log('\n[Test 4] Calling GET /api/tasks/stats WITHOUT token...');
    const noTokenRes = await httpRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks/stats',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('No-Token HTTP Status:', noTokenRes.status);
    console.log('No-Token Response Body:', noTokenRes.body);

    // Test 5: Call Stats with INVALID token
    console.log('\n[Test 5] Calling GET /api/tasks/stats with INVALID token...');
    const badTokenRes = await httpRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks/stats',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid_token_12345'
      }
    });
    console.log('Bad-Token HTTP Status:', badTokenRes.status);
    console.log('Bad-Token Response Body:', badTokenRes.body);

    console.log('\n=== STEP 3 COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('❌ DEBUG SCRIPT ERROR:', err);
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.connection.close();
    process.exit(0);
  }
};

runDebug();
