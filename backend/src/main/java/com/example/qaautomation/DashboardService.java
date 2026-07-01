package com.example.qaautomation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    private final TestCaseRepository testCaseRepository;

    public DashboardService(TestCaseRepository testCaseRepository) {
        this.testCaseRepository = testCaseRepository;
    }

    public ApiModels.DashboardResponse getDashboard() {
        long total = testCaseRepository.count();
        long passed = testCaseRepository.countByStatus(TestStatus.PASSED);
        long failed = testCaseRepository.countByStatus(TestStatus.FAILED);
        double passRate = total == 0 ? 0.0 : Math.round((passed * 10000.0 / total)) / 100.0;
        return new ApiModels.DashboardResponse(total, passed, failed, passRate);
    }
}
