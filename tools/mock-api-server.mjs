import http from 'node:http';

let nextProjectId = 6;
let nextTestCaseId = 8;
let nextResultId = 1;

const projects = [
  { id: 1, name: 'CRM Renewal Project', owner: 'Customer Platform Team', startDate: '2026-07-01' },
  { id: 2, name: 'Billing Modernization', owner: 'Platform Team', startDate: '2026-06-17' },
  { id: 3, name: 'Internal Project Portal', owner: 'QA Enablement Team', startDate: '2026-06-24' },
  { id: 4, name: 'Inventory Management System', owner: 'Supply Chain Team', startDate: '2026-06-10' },
  { id: 5, name: 'QA Automation Pilot', owner: 'Quality Engineering Team', startDate: '2026-07-01' }
];

const testCases = [
  { id: 1, projectId: 1, title: 'Create project from management screen', priority: 'High', status: 'PASSED' },
  { id: 2, projectId: 1, title: 'Register test execution result', priority: 'High', status: 'FAILED' },
  { id: 3, projectId: 2, title: 'Calculate dashboard pass rate', priority: 'Medium', status: 'PASSED' },
  { id: 4, projectId: 2, title: 'Block test case when external API is unavailable', priority: 'Low', status: 'BLOCKED' },
  { id: 5, projectId: 3, title: 'Validate project creation API', priority: 'High', status: 'PASSED' },
  { id: 6, projectId: 4, title: 'Update test case status', priority: 'Medium', status: 'IN_PROGRESS' },
  { id: 7, projectId: 5, title: 'Verify dashboard quality metrics', priority: 'High', status: 'NOT_STARTED' }
];

const results = [];

function send(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      resolve(body ? JSON.parse(body) : {});
    });
  });
}

function dashboard() {
  const totalTestCases = testCases.length;
  const passed = testCases.filter((testCase) => testCase.status === 'PASSED').length;
  const failed = testCases.filter((testCase) => testCase.status === 'FAILED').length;
  const passRate = totalTestCases === 0 ? 0 : Math.round((passed * 10000) / totalTestCases) / 100;
  return { totalTestCases, passed, failed, passRate };
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost:8080');

  if (request.method === 'OPTIONS') {
    return send(response, 200, {});
  }

  if (request.method === 'GET' && url.pathname === '/api/projects') {
    return send(response, 200, projects);
  }

  if (request.method === 'POST' && url.pathname === '/api/projects') {
    const body = await readBody(request);
    const project = { id: nextProjectId++, ...body };
    projects.push(project);
    return send(response, 200, project);
  }

  if (request.method === 'GET' && url.pathname === '/api/test-cases') {
    return send(response, 200, testCases);
  }

  if (request.method === 'POST' && url.pathname === '/api/test-cases') {
    const body = await readBody(request);
    const testCase = { id: nextTestCaseId++, ...body };
    testCases.push(testCase);
    return send(response, 200, testCase);
  }

  if (request.method === 'POST' && url.pathname === '/api/test-results') {
    const body = await readBody(request);
    const testCase = testCases.find((item) => item.id === Number(body.testCaseId));
    if (testCase) {
      testCase.status = body.status;
    }
    const result = { id: nextResultId++, executedAt: new Date().toISOString(), ...body };
    results.push(result);
    return send(response, 200, result);
  }

  if (request.method === 'GET' && url.pathname === '/api/test-results') {
    return send(response, 200, results);
  }

  if (request.method === 'GET' && url.pathname === '/api/dashboard') {
    return send(response, 200, dashboard());
  }

  return send(response, 404, { message: 'Not found' });
});

server.listen(8080, '127.0.0.1', () => {
  console.log('Mock API server is running at http://127.0.0.1:8080');
});
