import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './styles.css';

type TestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'BLOCKED';

type Project = {
  id: number;
  name: string;
  owner: string;
  startDate: string;
};

type TestCase = {
  id: number;
  projectId: number;
  title: string;
  priority: string;
  status: TestStatus;
};

type Dashboard = {
  totalTestCases: number;
  passed: number;
  failed: number;
  passRate: number;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
});

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard>({ totalTestCases: 0, passed: 0, failed: 0, passRate: 0 });
  const [projectName, setProjectName] = useState('');
  const [projectOwner, setProjectOwner] = useState('QA Enablement Team');
  const [testCaseTitle, setTestCaseTitle] = useState('');
  const [priority, setPriority] = useState('High');
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<number | ''>('');
  const [status, setStatus] = useState<TestStatus>('PASSED');

  async function refresh() {
    const [projectResponse, testCaseResponse, dashboardResponse] = await Promise.all([
      api.get<Project[]>('/api/projects'),
      api.get<TestCase[]>('/api/test-cases'),
      api.get<Dashboard>('/api/dashboard')
    ]);
    setProjects(projectResponse.data);
    setTestCases(testCaseResponse.data);
    setDashboard(dashboardResponse.data);
    setSelectedProjectId((current) => current || projectResponse.data[0]?.id || '');
    setSelectedTestCaseId((current) => current || testCaseResponse.data[0]?.id || '');
  }

  useEffect(() => {
    refresh();
  }, []);

  const projectNameById = useMemo(() => {
    return new Map(projects.map((project) => [project.id, project.name]));
  }, [projects]);

  async function createProject(event: FormEvent) {
    event.preventDefault();
    await api.post('/api/projects', {
      name: projectName,
      owner: projectOwner,
      startDate: new Date().toISOString().slice(0, 10)
    });
    setProjectName('');
    await refresh();
  }

  async function createTestCase(event: FormEvent) {
    event.preventDefault();
    await api.post('/api/test-cases', {
      projectId: selectedProjectId,
      title: testCaseTitle,
      priority,
      status: 'NOT_STARTED'
    });
    setTestCaseTitle('');
    await refresh();
  }

  async function registerResult(event: FormEvent) {
    event.preventDefault();
    await api.post('/api/test-results', {
      testCaseId: selectedTestCaseId,
      status,
      executedBy: 'portfolio-user',
      note: 'Registered from React UI'
    });
    await refresh();
  }

  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">QA Automation Standard Kit</p>
          <h1>Project Quality Dashboard</h1>
        </div>
      </header>

      <section className="metrics" aria-label="Dashboard">
        <article>
          <span>Total</span>
          <strong data-testid="total-cases">{dashboard.totalTestCases}</strong>
        </article>
        <article>
          <span>Passed</span>
          <strong>{dashboard.passed}</strong>
        </article>
        <article>
          <span>Failed</span>
          <strong>{dashboard.failed}</strong>
        </article>
        <article>
          <span>Pass Rate</span>
          <strong data-testid="pass-rate">{dashboard.passRate}%</strong>
        </article>
      </section>

      <section className="workspace">
        <form onSubmit={createProject}>
          <h2>Create Project</h2>
          <label>
            Project Name
            <input aria-label="Project Name" value={projectName} onChange={(event) => setProjectName(event.target.value)} required />
          </label>
          <label>
            Owner
            <input aria-label="Owner" value={projectOwner} onChange={(event) => setProjectOwner(event.target.value)} required />
          </label>
          <button type="submit">Create Project</button>
        </form>

        <form onSubmit={createTestCase}>
          <h2>Create Test Case</h2>
          <label>
            Project
            <select aria-label="Project" value={selectedProjectId} onChange={(event) => setSelectedProjectId(Number(event.target.value))} required>
              {projects.map((project) => (
                <option value={project.id} key={project.id}>{project.name}</option>
              ))}
            </select>
          </label>
          <label>
            Test Case Title
            <input aria-label="Test Case Title" value={testCaseTitle} onChange={(event) => setTestCaseTitle(event.target.value)} required />
          </label>
          <label>
            Priority
            <select aria-label="Priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
          <button type="submit">Create Test Case</button>
        </form>

        <form onSubmit={registerResult}>
          <h2>Register Result</h2>
          <label>
            Test Case
            <select aria-label="Test Case" value={selectedTestCaseId} onChange={(event) => setSelectedTestCaseId(Number(event.target.value))} required>
              {testCases.map((testCase) => (
                <option value={testCase.id} key={testCase.id}>{testCase.title}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value as TestStatus)}>
              <option>NOT_STARTED</option>
              <option>IN_PROGRESS</option>
              <option>PASSED</option>
              <option>FAILED</option>
              <option>BLOCKED</option>
            </select>
          </label>
          <button type="submit">Register Result</button>
        </form>
      </section>

      <section className="lists">
        <div>
          <h2>Projects</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <strong>{project.name}</strong>
                <span>{project.owner}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Test Cases</h2>
          <ul>
            {testCases.map((testCase) => (
              <li key={testCase.id}>
                <strong>{testCase.title}</strong>
                <span>{projectNameById.get(testCase.projectId)} / {testCase.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
