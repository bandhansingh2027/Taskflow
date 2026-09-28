const http = require('http');
const app = require('./server');

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

const runAuthTests = async () => {
  console.log('=== AUTHENTICATION VERIFICATION SUITE ===\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Auth test server running on port ${port}`);

  try {
    const timestamp = Date.now();
    const testEmail = `newuser_${timestamp}@taskflow.com`;
    const testPassword = 'password123';
    const testName = 'New Registered User';

    // TEST 1: Register a new user
    console.log('\n[TEST 1] Registering a new user:', testEmail);
    const regRes = await request(server, 'POST', '/api/auth/register', {
      name: testName,
      email: testEmail,
      password: testPassword
    });
    console.log('Register HTTP Status:', regRes.status);
    console.log('Register Response:', regRes.body);
    if (regRes.status !== 201 || !regRes.body.token || !regRes.body._id) {
      throw new Error('TEST 1 FAILED: Registration did not return 201 or token/_id');
    }
    console.log('✔ TEST 1 PASSED');

    // TEST 2: Login with that newly registered user
    console.log('\n[TEST 2] Logging in with newly registered user...');
    const loginNewRes = await request(server, 'POST', '/api/auth/login', {
      email: testEmail,
      password: testPassword
    });
    console.log('New User Login Status:', loginNewRes.status);
    console.log('New User Login Response:', loginNewRes.body);
    if (loginNewRes.status !== 200 || !loginNewRes.body.token) {
      throw new Error('TEST 2 FAILED: Login with new user failed');
    }
    const newUserToken = loginNewRes.body.token;
    console.log('✔ TEST 2 PASSED');

    // TEST 3: Login with demo account (demo@taskflow.com / demo123)
    console.log('\n[TEST 3] Logging in with demo account (demo@taskflow.com / demo123)...');
    const loginDemoRes = await request(server, 'POST', '/api/auth/login', {
      email: 'demo@taskflow.com',
      password: 'demo123'
    });
    console.log('Demo Login Status:', loginDemoRes.status);
    console.log('Demo User Name:', loginDemoRes.body.name);
    if (loginDemoRes.status !== 200 || !loginDemoRes.body.token) {
      throw new Error('TEST 3 FAILED: Login with demo account failed');
    }
    const demoToken = loginDemoRes.body.token;
    console.log('✔ TEST 3 PASSED');

    // TEST 4: Open dashboard after login
    console.log('\n[TEST 4] Opening dashboard APIs after login...');
    const statsRes = await request(server, 'GET', '/api/tasks/stats', null, demoToken);
    const tasksRes = await request(server, 'GET', '/api/tasks', null, demoToken);
    console.log('Dashboard Stats Status:', statsRes.status, 'Total tasks:', statsRes.body.total);
    console.log('Dashboard Tasks Status:', tasksRes.status, 'Tasks count:', tasksRes.body.length);
    if (statsRes.status !== 200 || tasksRes.status !== 200) {
      throw new Error('TEST 4 FAILED: Dashboard APIs returned non-200');
    }
    console.log('✔ TEST 4 PASSED');

    // TEST 5: Refresh dashboard and verify authentication still works
    console.log('\n[TEST 5] Simulating dashboard refresh with stored token...');
    const statsRefreshedRes = await request(server, 'GET', '/api/tasks/stats', null, demoToken);
    if (statsRefreshedRes.status !== 200 || statsRefreshedRes.body.total === undefined) {
      throw new Error('TEST 5 FAILED: Dashboard refresh request failed');
    }
    console.log('✔ TEST 5 PASSED');

    // TEST 6: Logout (Simulation: verify invalid/expired request behaves correctly)
    console.log('\n[TEST 6] Simulating Logout & Unauthenticated Request...');
    const noTokenRes = await request(server, 'GET', '/api/tasks/stats');
    console.log('No-token request status (expect 401):', noTokenRes.status);
    if (noTokenRes.status !== 401) {
      throw new Error('TEST 6 FAILED: Unauthenticated request did not return 401');
    }
    console.log('✔ TEST 6 PASSED');

    // TEST 7: Login again
    console.log('\n[TEST 7] Logging in again with demo credentials...');
    const loginAgainRes = await request(server, 'POST', '/api/auth/login', {
      email: 'demo@taskflow.com',
      password: 'demo123'
    });
    console.log('Re-login status:', loginAgainRes.status);
    if (loginAgainRes.status !== 200 || !loginAgainRes.body.token) {
      throw new Error('TEST 7 FAILED: Re-login failed');
    }
    console.log('✔ TEST 7 PASSED');

    console.log('\n======================================================');
    console.log('ALL 7 AUTHENTICATION TESTS PASSED 100%! 🎉');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Auth Verification Suite Error:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
};

runAuthTests();
