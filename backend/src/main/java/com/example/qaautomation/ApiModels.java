package com.example.qaautomation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ApiModels {
    public record ProjectRequest(@NotBlank String name, String owner, LocalDate startDate) {
    }

    public record ProjectResponse(Long id, String name, String owner, LocalDate startDate) {
        static ProjectResponse from(Project project) {
            return new ProjectResponse(project.getId(), project.getName(), project.getOwner(), project.getStartDate());
        }
    }

    public record TestCaseRequest(@NotNull Long projectId, @NotBlank String title, String priority, TestStatus status) {
    }

    public record TestCaseResponse(Long id, Long projectId, String title, String priority, TestStatus status) {
        static TestCaseResponse from(TestCase testCase) {
            return new TestCaseResponse(
                    testCase.getId(),
                    testCase.getProject().getId(),
                    testCase.getTitle(),
                    testCase.getPriority(),
                    testCase.getStatus()
            );
        }
    }

    public record TestResultRequest(@NotNull Long testCaseId, @NotNull TestStatus status, String executedBy, String note) {
    }

    public record TestResultResponse(Long id, Long testCaseId, TestStatus status, String executedBy, String note, LocalDateTime executedAt) {
        static TestResultResponse from(TestResult result) {
            return new TestResultResponse(
                    result.getId(),
                    result.getTestCase().getId(),
                    result.getStatus(),
                    result.getExecutedBy(),
                    result.getNote(),
                    result.getExecutedAt()
            );
        }
    }

    public record DashboardResponse(long totalTestCases, long passed, long failed, double passRate) {
    }
}
