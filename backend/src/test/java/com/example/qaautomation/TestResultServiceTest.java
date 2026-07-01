package com.example.qaautomation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TestResultServiceTest {
    @Mock
    TestCaseService testCaseService;

    @Mock
    TestResultRepository testResultRepository;

    @InjectMocks
    TestResultService testResultService;

    @Test
    void create_updatesTestCaseStatusAndStoresResult() {
        Project project = new Project("Portal", "QA", LocalDate.now());
        TestCase testCase = new TestCase(project, "Login smoke", "High", TestStatus.IN_PROGRESS);
        when(testCaseService.updateStatus(1L, TestStatus.PASSED)).thenReturn(testCase);
        when(testResultRepository.save(any(TestResult.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TestResult result = testResultService.create(new ApiModels.TestResultRequest(1L, TestStatus.PASSED, "tester", "ok"));

        assertThat(result.getStatus()).isEqualTo(TestStatus.PASSED);
        assertThat(result.getExecutedBy()).isEqualTo("tester");
        assertThat(result.getExecutedAt()).isNotNull();
        verify(testCaseService).updateStatus(1L, TestStatus.PASSED);
    }
}
