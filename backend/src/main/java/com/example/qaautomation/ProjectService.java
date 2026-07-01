package com.example.qaautomation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project create(ApiModels.ProjectRequest request) {
        return projectRepository.save(new Project(request.name(), request.owner(), request.startDate()));
    }

    public Project update(Long id, ApiModels.ProjectRequest request) {
        Project project = findById(id);
        project.setName(request.name());
        project.setOwner(request.owner());
        project.setStartDate(request.startDate());
        return project;
    }

    public void delete(Long id) {
        projectRepository.delete(findById(id));
    }

    Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }
}
