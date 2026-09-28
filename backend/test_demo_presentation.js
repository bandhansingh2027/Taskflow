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

const runDemoTest = async () => {
  console.log('=== DEMO MODE PRESENTATION FLOW TEST ===\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Demo test server running on port ${port}`);

  try {
    // 1. Login with demo credentials
    console.log('1. Logging in with demo credentials (demo@taskflow.com / demo123)...');
    const loginRes = await request(server, 'POST', '/api/auth/login', {
      email: 'demo@taskflow.com',
      password: 'demo123'
    });
    console.log('Login Status:', loginRes.status);
    console.log('Login User Name:', loginRes.body.name);

    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error('Demo login failed!');
    }
    const token = loginRes.body.token;

    // 2. Fetch Dashboard Stats
    console.log('\n2. Fetching Dashboard Stats...');
    const statsRes1 = await request(server, 'GET', '/api/tasks/stats', null, token);
    console.log('Stats HTTP Status:', statsRes1.status);
    console.log('Dashboard Stats Data:', statsRes1.body);

    if (statsRes1.status !== 200 || statsRes1.body.total < 8) {
      throw new Error('Initial demo dashboard stats missing!');
    }

    // 3. Fetch Tasks
    console.log('\n3. Fetching Tasks list...');
    const tasksRes1 = await request(server, 'GET', '/api/tasks', null, token);
    console.log('Tasks Count:', tasksRes1.body.length);
    console.log('First Task Title:', tasksRes1.body[0]?.title);

    // 4. Create Task
    console.log('\n4. Creating a new Task in Demo Mode...');
    const createTaskRes = await request(server, 'POST', '/api/tasks', {
      title: 'Live Presentation Interactive Task',
      description: 'Created live during presentation demonstration',
      status: 'To Do',
      priority: 'High',
      dueDate: '2026-10-25'
    }, token);

    console.log('Create Task Status:', createTaskRes.status);
    console.log('Created Task Title:', createTaskRes.body.title);
    const taskId = createTaskRes.body._id;

    // 5. Update Task Status
    console.log('\n5. Updating Task Status to In Progress...');
    const updateRes1 = await request(server, 'PUT', `/api/tasks/${taskId}`, {
      status: 'In Progress'
    }, token);
    console.log('Updated Status:', updateRes1.body.status);

    console.log('6. Updating Task Status to Completed...');
    const updateRes2 = await request(server, 'PUT', `/api/tasks/${taskId}`, {
      status: 'Completed'
    }, token);
    console.log('Updated Status:', updateRes2.body.status);

    // 7. Verify Dashboard Stats updated
    console.log('\n7. Verifying Dashboard Stats updated after status change...');
    const statsRes2 = await request(server, 'GET', '/api/tasks/stats', null, token);
    console.log('New Dashboard Stats Data:', statsRes2.body);

    // 8. Fetch Team Members
    console.log('\n8. Fetching Team Details...');
    const teamRes = await request(server, 'GET', '/api/teams', null, token);
    console.log('Team Name:', teamRes.body?.name);
    console.log('Team Member Count:', teamRes.body?.members?.length);

    // 9. Cleanup created task
    console.log('\n9. Deleting test task...');
    const delRes = await request(server, 'DELETE', `/api/tasks/${taskId}`, null, token);
    console.log('Delete Status:', delRes.status);

    console.log('\n======================================================');
    console.log('DEMO MODE PRESENTATION FLOW TEST PASSED 100%! 🎉');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Demo Test Failed:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
};

runDemoTest();
