const http = require('http');
const app = require('./server');
const mongoose = require('mongoose');

const request = (server, method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const payload = data ? JSON.stringify(data) : null;

    const options = {
      hostname: '127.0.0.1',
      port: address.port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

const verifyStep7 = async () => {
  console.log('=== STEP 7: FULL VERIFICATION SUITE ===\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Backend server listening for Step 7 test on port ${port}`);

  try {
    const timestamp = Date.now();
    const email = `step7_user_${timestamp}@example.com`;
    const password = 'password123';

    // 1. Register User
    console.log('Step 7.1: Registering new user:', email);
    const regRes = await request(server, 'POST', '/api/auth/register', {
      name: 'Step 7 Tester',
      email: email,
      password: password
    });
    console.log('Register HTTP Status:', regRes.status);
    if (regRes.status !== 201) throw new Error('Registration failed');

    // 2. Login
    console.log('\nStep 7.2: Logging in...');
    const loginRes = await request(server, 'POST', '/api/auth/login', {
      email,
      password
    });
    console.log('Login HTTP Status:', loginRes.status);
    if (loginRes.status !== 200 || !loginRes.body.token) throw new Error('Login failed');
    const token = loginRes.body.token;

    // 3. Open /dashboard (Call /api/tasks/stats & /api/tasks)
    console.log('\nStep 7.3 & 7.4: Fetching Dashboard Data (GET /api/tasks/stats & GET /api/tasks)...');
    const statsRes1 = await request(server, 'GET', '/api/tasks/stats', null, token);
    const tasksRes1 = await request(server, 'GET', '/api/tasks', null, token);

    console.log('GET /api/tasks/stats Status:', statsRes1.status);
    console.log('GET /api/tasks/stats Body:', statsRes1.body);
    console.log('GET /api/tasks Status:', tasksRes1.status);
    console.log('GET /api/tasks Count:', tasksRes1.body.length);

    if (statsRes1.status !== 200 || tasksRes1.status !== 200) {
      throw new Error('Dashboard endpoints failed to return 200');
    }

    // 4. Create a Task
    console.log('\nStep 7.5: Creating a Task...');
    const createTaskRes = await request(server, 'POST', '/api/tasks', {
      title: 'Real Database Task #1',
      description: 'Verifying data persistence',
      status: 'To Do',
      priority: 'High',
      dueDate: '2026-10-15'
    }, token);
    console.log('POST /api/tasks Status:', createTaskRes.status);
    console.log('Created Task Title:', createTaskRes.body.title);
    if (createTaskRes.status !== 201) throw new Error('Task creation failed');

    // 5. Refresh Dashboard (Fetch /api/tasks/stats & /api/tasks again)
    console.log('\nStep 7.6 & 7.7: Refreshing Dashboard & Verifying updated statistics...');
    const statsRes2 = await request(server, 'GET', '/api/tasks/stats', null, token);
    const tasksRes2 = await request(server, 'GET', '/api/tasks', null, token);

    console.log('Updated Stats:', statsRes2.body);
    console.log('Updated Task List Count:', tasksRes2.body.length);

    if (statsRes2.body.total !== 1 || statsRes2.body.pending !== 1) {
      throw new Error('Statistics failed to reflect newly created task!');
    }

    // 6. Logout & Login again to verify data persistence
    console.log('\nStep 7.8 & 7.9: Simulating Logout & Re-authenticating...');
    const reloginRes = await request(server, 'POST', '/api/auth/login', {
      email,
      password
    });
    console.log('Re-login HTTP Status:', reloginRes.status);
    const newToken = reloginRes.body.token;

    // 7. Verify Data Persists
    console.log('\nStep 7.10: Verifying data persists across sessions...');
    const statsRes3 = await request(server, 'GET', '/api/tasks/stats', null, newToken);
    const tasksRes3 = await request(server, 'GET', '/api/tasks', null, newToken);

    console.log('Persisted Stats:', statsRes3.body);
    console.log('Persisted Task List Title:', tasksRes3.body[0]?.title);

    if (statsRes3.body.total !== 1 || tasksRes3.body[0]?.title !== 'Real Database Task #1') {
      throw new Error('Data persistence check failed!');
    }

    console.log('\n=============================================================');
    console.log('ALL STEP 7 VERIFICATION CHECKS PASSED SUCCESSFULLY! 🚀');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('❌ Step 7 Verification Failed:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(process.exitCode || 0);
  }
};

verifyStep7();
