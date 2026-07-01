package com.example.qaautomation;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_case_id", nullable = false)
    @NotNull
    private TestCase testCase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestStatus status;

    private String executedBy;
    private String note;
    private LocalDateTime executedAt;

    protected TestResult() {
    }

    public TestResult(TestCase testCase, TestStatus status, String executedBy, String note, LocalDateTime executedAt) {
        this.testCase = testCase;
        this.status = status;
        this.executedBy = executedBy;
        this.note = note;
        this.executedAt = executedAt;
    }

    public Long getId() {
        return id;
    }

    public TestCase getTestCase() {
        return testCase;
    }

    public TestStatus getStatus() {
        return status;
    }

    public String getExecutedBy() {
        return executedBy;
    }

    public String getNote() {
        return note;
    }

    public LocalDateTime getExecutedAt() {
        return executedAt;
    }
}
