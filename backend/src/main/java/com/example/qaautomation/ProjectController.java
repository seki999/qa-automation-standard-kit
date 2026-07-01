package com.example.qaautomation;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ApiModels.ProjectResponse> findAll() {
        return projectService.findAll().stream().map(ApiModels.ProjectResponse::from).toList();
    }

    @PostMapping
    public ApiModels.ProjectResponse create(@Valid @RequestBody ApiModels.ProjectRequest request) {
        return ApiModels.ProjectResponse.from(projectService.create(request));
    }

    @PutMapping("/{id}")
    public ApiModels.ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ApiModels.ProjectRequest request) {
        return ApiModels.ProjectResponse.from(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }
}
