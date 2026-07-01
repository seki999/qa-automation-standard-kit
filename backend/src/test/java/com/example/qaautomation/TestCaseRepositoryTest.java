package com.example.qaautomation;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TestCaseRepositoryTest {
    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    TestCaseRepository testCaseRepository;

    @Test
    void countByStatus_returnsStatusSpecificCount() {
        Project project = projectRepository.save(new Project("Repository Test", "QA", LocalDate.now()));
        testCaseRepository.save(new TestCase(project, "passed case", "High", TestStatus.PASSED));
        testCaseRepository.save(new TestCase(project, "failed case", "High", TestStatus.FAILED));

        assertThat(testCaseRepository.countByStatus(TestStatus.PASSED)).isEqualTo(1);
        assertThat(testCaseRepository.findByProjectId(project.getId())).hasSize(2);
    }
}
