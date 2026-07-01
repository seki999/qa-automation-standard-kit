package com.example.qaautomation;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
public class SampleDataLoader implements CommandLineRunner {
    private final ProjectRepository projectRepository;
    private final TestCaseRepository testCaseRepository;

    public SampleDataLoader(ProjectRepository projectRepository, TestCaseRepository testCaseRepository) {
        this.projectRepository = projectRepository;
        this.testCaseRepository = testCaseRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (projectRepository.count() > 0) {
            return;
        }
        Project portal = projectRepository.save(new Project("Internal Project Portal", "QA Enablement Team", LocalDate.now()));
        Project billing = projectRepository.save(new Project("Billing Modernization", "Platform Team", LocalDate.now().minusDays(14)));

        testCaseRepository.save(new TestCase(portal, "Create project from project management screen", "High", TestStatus.PASSED));
        testCaseRepository.save(new TestCase(portal, "Register execution result from test case detail", "High", TestStatus.FAILED));
        testCaseRepository.save(new TestCase(billing, "Calculate dashboard pass rate", "Medium", TestStatus.IN_PROGRESS));
        testCaseRepository.save(new TestCase(billing, "Block test case when external API is unavailable", "Low", TestStatus.BLOCKED));
    }
}
