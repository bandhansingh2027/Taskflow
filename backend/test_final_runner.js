const http = require('http');
const app = require('./server');
const mongoose = require('mongoose');

// Helper for HTTP requests
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
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, body: json });
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

const runTests = async () => {
  console.log('=== TaskFlow Comprehensive Integration Test Suite ===');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  try {
    const timestamp = Date.now();
    const user1Email = `user1_${timestamp}@example.com`;
    const user2Email = `user2_${timestamp}@example.com`;

    // 1. Register User 1
    console.log('1. Registering User 1...');
    const reg1Res = await request(server, 'POST', '/api/auth/register', {
      name: 'Alice Leader',
      email: user1Email,
      password: 'password123'
    });
    if (reg1Res.status !== 201 || !reg1Res.body.token) {
      throw new Error(`User 1 registration failed: ${JSON.stringify(reg1Res.body)}`);
    }
    const token1 = reg1Res.body.token;
    const user1Id = reg1Res.body._id;
    console.log('✔ User 1 registered successfully');

    // 2. Register User 2
    console.log('2. Registering User 2...');
    const reg2Res = await request(server, 'POST', '/api/auth/register', {
      name: 'Bob Member',
      email: user2Email,
      password: 'password123'
    });
    if (reg2Res.status !== 201 || !reg2Res.body.token) {
      throw new Error(`User 2 registration failed: ${JSON.stringify(reg2Res.body)}`);
    }
    const user2Id = reg2Res.body._id;
    console.log('✔ User 2 registered successfully');

    // 3. Login User 1
    console.log('3. Testing Login for User 1...');
    const loginRes = await request(server, 'POST', '/api/auth/login', {
      email: user1Email,
      password: 'password123'
    });
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    console.log('✔ User 1 login verified');

    // 4. Create Team
    console.log('4. Creating Team...');
    const createTeamRes = await request(server, 'POST', '/api/teams', {
      name: 'Alpha Engineering',
      description: 'Core dev team'
    }, token1);
    if (createTeamRes.status !== 201 || !createTeamRes.body._id) {
      throw new Error(`Create team failed: ${JSON.stringify(createTeamRes.body)}`);
    }
    const teamId = createTeamRes.body._id;
    console.log('✔ Team created successfully');

    // 5. Add User 2 to Team
    console.log('5. Adding User 2 to Team...');
    const addMemberRes = await request(server, 'POST', `/api/teams/${teamId}/members`, {
      email: user2Email
    }, token1);
    if (addMemberRes.status !== 200 || addMemberRes.body.members.length < 2) {
      throw new Error(`Add member failed: ${JSON.stringify(addMemberRes.body)}`);
    }
    console.log('✔ Member added successfully');

    // 6. Get Initial Dashboard Stats
    console.log('6. Checking initial Dashboard Stats...');
    const initialStatsRes = await request(server, 'GET', '/api/tasks/stats', null, token1);
    if (initialStatsRes.status !== 200 || initialStatsRes.body.total !== 0) {
      throw new Error(`Initial stats unexpected: ${JSON.stringify(initialStatsRes.body)}`);
    }
    console.log('✔ Initial stats verified (total = 0)');

    // 7. Create Task assigned to User 2 with due date
    console.log('7. Creating Task assigned to User 2...');
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const createTaskRes = await request(server, 'POST', '/api/tasks', {
      title: 'Build Dashboard Component',
      description: 'Implement responsive team task view',
      status: 'To Do',
      priority: 'High',
      assignedTo: user2Id,
      dueDate: dueDate
    }, token1);
    if (createTaskRes.status !== 201 || !createTaskRes.body._id) {
      throw new Error(`Create task failed: ${JSON.stringify(createTaskRes.body)}`);
    }
    const taskId = createTaskRes.body._id;
    if (createTaskRes.body.priority !== 'High' || !createTaskRes.body.dueDate) {
      throw new Error(`Task fields mismatch: ${JSON.stringify(createTaskRes.body)}`);
    }
    console.log('✔ Task created with due date and assignee successfully');

    // 8. Verify Stats after task creation
    console.log('8. Verifying Dashboard Stats after Task creation...');
    const stats2Res = await request(server, 'GET', '/api/tasks/stats', null, token1);
    if (stats2Res.status !== 200 || stats2Res.body.total !== 1 || stats2Res.body.pending !== 1) {
      throw new Error(`Stats after creation mismatch: ${JSON.stringify(stats2Res.body)}`);
    }
    console.log('✔ Dashboard stats updated (total = 1, pending = 1)');

    // 9. Update Task status to "In Progress"
    console.log('9. Updating Task status to In Progress...');
    const updateTaskRes1 = await request(server, 'PUT', `/api/tasks/${taskId}`, {
      status: 'In Progress'
    }, token1);
    if (updateTaskRes1.status !== 200 || updateTaskRes1.body.status !== 'In Progress') {
      throw new Error(`Update status to In Progress failed: ${JSON.stringify(updateTaskRes1.body)}`);
    }
    console.log('✔ Task status updated to In Progress');

    // 10. Check Stats after In Progress update
    console.log('10. Checking Stats after status change...');
    const stats3Res = await request(server, 'GET', '/api/tasks/stats', null, token1);
    if (stats3Res.status !== 200 || stats3Res.body.inProgress !== 1 || stats3Res.body.pending !== 0) {
      throw new Error(`Stats in progress mismatch: ${JSON.stringify(stats3Res.body)}`);
    }
    console.log('✔ Stats updated (inProgress = 1, pending = 0)');

    // 11. Update Task status to "Completed"
    console.log('11. Updating Task status to Completed...');
    const updateTaskRes2 = await request(server, 'PUT', `/api/tasks/${taskId}`, {
      status: 'Completed'
    }, token1);
    if (updateTaskRes2.status !== 200 || updateTaskRes2.body.status !== 'Completed') {
      throw new Error(`Update status to Completed failed: ${JSON.stringify(updateTaskRes2.body)}`);
    }

    const stats4Res = await request(server, 'GET', '/api/tasks/stats', null, token1);
    if (stats4Res.status !== 200 || stats4Res.body.completed !== 1) {
      throw new Error(`Stats completed mismatch: ${JSON.stringify(stats4Res.body)}`);
    }
    console.log('✔ Stats updated (completed = 1)');

    // 12. Delete Task
    console.log('12. Deleting Task...');
    const deleteTaskRes = await request(server, 'DELETE', `/api/tasks/${taskId}`, null, token1);
    if (deleteTaskRes.status !== 200) {
      throw new Error(`Delete task failed: ${JSON.stringify(deleteTaskRes.body)}`);
    }
    console.log('✔ Task deleted successfully');

    // 13. Verify Task count after deletion
    const finalStatsRes = await request(server, 'GET', '/api/tasks/stats', null, token1);
    if (finalStatsRes.status !== 200 || finalStatsRes.body.total !== 0) {
      throw new Error(`Final stats mismatch: ${JSON.stringify(finalStatsRes.body)}`);
    }
    console.log('✔ Final stats verified (total = 0)');

    console.log('\n======================================================');
    console.log('ALL TASKFLOW INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ INTEGRATION TEST FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(process.exitCode || 0);
  }
};

runTests();
