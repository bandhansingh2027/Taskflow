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

const runMasterTests = async () => {
  console.log('====================================================');
  console.log('TASKFLOW MASTER PRESENTATION END-TO-END TEST SUITE');
  console.log('====================================================\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Test server active on port ${port}`);

  try {
    // 1. Login with Demo Account
    console.log('\n[1] Logging in with demo account (demo@taskflow.com / demo123)...');
    const loginRes = await request(server, 'POST', '/api/auth/login', {
      email: 'demo@taskflow.com',
      password: 'demo123'
    });
    console.log('Login Status:', loginRes.status);
    console.log('User Name:', loginRes.body.name);
    if (loginRes.status !== 200 || !loginRes.body.token) throw new Error('Demo login failed');
    const token = loginRes.body.token;

    // 2. Test Dashboard Stats APIs (Both /api/tasks/stats and /api/dashboard/stats)
    console.log('\n[2] Testing Dashboard Stats Endpoints...');
    const taskStatsRes = await request(server, 'GET', '/api/tasks/stats', null, token);
    const dashStatsRes = await request(server, 'GET', '/api/dashboard/stats', null, token);
    console.log('GET /api/tasks/stats:', taskStatsRes.status, 'Total:', taskStatsRes.body.total);
    console.log('GET /api/dashboard/stats:', dashStatsRes.status, 'Total:', dashStatsRes.body.total);
    if (taskStatsRes.status !== 200 || dashStatsRes.status !== 200) throw new Error('Dashboard stats failed');

    // 3. Test Dashboard Recent API (/api/dashboard/recent)
    console.log('\n[3] Testing GET /api/dashboard/recent Endpoint...');
    const dashRecentRes = await request(server, 'GET', '/api/dashboard/recent', null, token);
    console.log('GET /api/dashboard/recent Status:', dashRecentRes.status, 'Recent Count:', dashRecentRes.body.length);
    if (dashRecentRes.status !== 200 || !Array.isArray(dashRecentRes.body)) throw new Error('Dashboard recent failed');

    // 4. Test Task List API (/api/tasks)
    console.log('\n[4] Testing GET /api/tasks Endpoint...');
    const tasksRes = await request(server, 'GET', '/api/tasks', null, token);
    console.log('GET /api/tasks Status:', tasksRes.status, 'Count:', tasksRes.body.length);
    if (tasksRes.status !== 200 || !Array.isArray(tasksRes.body)) throw new Error('Get tasks failed');

    // 5. Test Create Task API (/api/tasks)
    console.log('\n[5] Testing POST /api/tasks Endpoint...');
    const createTaskRes = await request(server, 'POST', '/api/tasks', {
      title: 'Presentation Verification Task',
      description: 'Created during automated master check',
      status: 'To Do',
      priority: 'High',
      dueDate: '2026-11-01'
    }, token);
    console.log('POST /api/tasks Status:', createTaskRes.status, 'Task ID:', createTaskRes.body._id);
    if (createTaskRes.status !== 201 || !createTaskRes.body._id) throw new Error('Create task failed');
    const taskId = createTaskRes.body._id;

    // 6. Test GET Task By ID (/api/tasks/:id)
    console.log('\n[6] Testing GET /api/tasks/:id Endpoint...');
    const getTaskRes = await request(server, 'GET', `/api/tasks/${taskId}`, null, token);
    console.log('GET /api/tasks/:id Status:', getTaskRes.status, 'Title:', getTaskRes.body.title);
    if (getTaskRes.status !== 200 || getTaskRes.body.title !== 'Presentation Verification Task') {
      throw new Error('Get task by ID failed');
    }

    // 7. Test PATCH Status Update (/api/tasks/:id/status)
    console.log('\n[7] Testing PATCH /api/tasks/:id/status Endpoint...');
    const patchStatusRes = await request(server, 'PATCH', `/api/tasks/${taskId}/status`, {
      status: 'In Progress'
    }, token);
    console.log('PATCH Status:', patchStatusRes.status, 'Updated Status:', patchStatusRes.body.status);
    if (patchStatusRes.status !== 200 || patchStatusRes.body.status !== 'In Progress') {
      throw new Error('PATCH task status failed');
    }

    // 8. Test PUT Update Task (/api/tasks/:id)
    console.log('\n[8] Testing PUT /api/tasks/:id Endpoint...');
    const putTaskRes = await request(server, 'PUT', `/api/tasks/${taskId}`, {
      title: 'Updated Presentation Task',
      status: 'Completed'
    }, token);
    console.log('PUT Status:', putTaskRes.status, 'New Title:', putTaskRes.body.title, 'New Status:', putTaskRes.body.status);
    if (putTaskRes.status !== 200 || putTaskRes.body.status !== 'Completed') {
      throw new Error('PUT update task failed');
    }

    // 9. Test DELETE Task (/api/tasks/:id)
    console.log('\n[9] Testing DELETE /api/tasks/:id Endpoint...');
    const delTaskRes = await request(server, 'DELETE', `/api/tasks/${taskId}`, null, token);
    console.log('DELETE Status:', delTaskRes.status);
    if (delTaskRes.status !== 200) throw new Error('DELETE task failed');

    // 10. Test Team API (/api/teams)
    console.log('\n[10] Testing GET /api/teams Endpoint...');
    const teamRes = await request(server, 'GET', '/api/teams', null, token);
    console.log('GET /api/teams Status:', teamRes.status, 'Team Name:', teamRes.body.name, 'Members:', teamRes.body.members?.length);
    if (teamRes.status !== 200 || !teamRes.body.name) throw new Error('Team API failed');

    console.log('\n====================================================');
    console.log('ALL MASTER PRESENTATION CHECKS PASSED 100%! 🚀🎉');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ Master Test Suite Failed:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
};

runMasterTests();
