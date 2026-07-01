package com.example.qaautomation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TestResultService {
    private final TestCaseService testCaseService;
    private final TestResultRepository testResultRepository;

    public TestResultService(TestCaseService testCaseService, TestResultRepository testResultRepository) {
        this.testCaseService = testCaseService;
        this.testResultRepository = testResultRepository;
    }

    public List<TestResult> findAll() {
        return testResultRepository.findAll();
    }

    public TestResult create(ApiModels.TestResultRequest request) {
        TestCase testCase = testCaseService.updateStatus(request.testCaseId(), request.status());
        return testResultRepository.save(new TestResult(
                testCase,
                request.status(),
                request.executedBy(),
                request.note(),
                LocalDateTime.now()
        ));
    }
}
