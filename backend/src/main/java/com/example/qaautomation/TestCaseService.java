package com.example.qaautomation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TestCaseService {
    private final ProjectService projectService;
    private final TestCaseRepository testCaseRepository;

    public TestCaseService(ProjectService projectService, TestCaseRepository testCaseRepository) {
        this.projectService = projectService;
        this.testCaseRepository = testCaseRepository;
    }

    public List<TestCase> findAll() {
        return testCaseRepository.findAll();
    }

    public TestCase create(ApiModels.TestCaseRequest request) {
        Project project = projectService.findById(request.projectId());
        TestStatus status = request.status() == null ? TestStatus.NOT_STARTED : request.status();
        return testCaseRepository.save(new TestCase(project, request.title(), request.priority(), status));
    }

    public TestCase update(Long id, ApiModels.TestCaseRequest request) {
        TestCase testCase = findById(id);
        testCase.setTitle(request.title());
        testCase.setPriority(request.priority());
        testCase.setStatus(request.status() == null ? testCase.getStatus() : request.status());
        return testCase;
    }

    public TestCase updateStatus(Long id, TestStatus status) {
        TestCase testCase = findById(id);
        testCase.setStatus(status);
        return testCase;
    }

    public void delete(Long id) {
        testCaseRepository.delete(findById(id));
    }

    TestCase findById(Long id) {
        return testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found: " + id));
    }
}
