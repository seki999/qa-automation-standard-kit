package com.example.qaautomation;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-results")
@CrossOrigin(origins = "*")
public class TestResultController {
    private final TestResultService testResultService;

    public TestResultController(TestResultService testResultService) {
        this.testResultService = testResultService;
    }

    @GetMapping
    public List<ApiModels.TestResultResponse> findAll() {
        return testResultService.findAll().stream().map(ApiModels.TestResultResponse::from).toList();
    }

    @PostMapping
    public ApiModels.TestResultResponse create(@Valid @RequestBody ApiModels.TestResultRequest request) {
        return ApiModels.TestResultResponse.from(testResultService.create(request));
    }
}
