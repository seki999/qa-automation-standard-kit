package com.example.qaautomation;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-cases")
@CrossOrigin(origins = "*")
public class TestCaseController {
    private final TestCaseService testCaseService;

    public TestCaseController(TestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @GetMapping
    public List<ApiModels.TestCaseResponse> findAll() {
        return testCaseService.findAll().stream().map(ApiModels.TestCaseResponse::from).toList();
    }

    @PostMapping
    public ApiModels.TestCaseResponse create(@Valid @RequestBody ApiModels.TestCaseRequest request) {
        return ApiModels.TestCaseResponse.from(testCaseService.create(request));
    }

    @PutMapping("/{id}")
    public ApiModels.TestCaseResponse update(@PathVariable Long id, @Valid @RequestBody ApiModels.TestCaseRequest request) {
        return ApiModels.TestCaseResponse.from(testCaseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        testCaseService.delete(id);
    }
}
