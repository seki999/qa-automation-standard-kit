package com.example.qaautomation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Mock
    ProjectRepository projectRepository;

    @InjectMocks
    ProjectService projectService;

    @Test
    void create_savesProjectFromRequest() {
        ApiModels.ProjectRequest request = new ApiModels.ProjectRequest("QA Platform", "QA Team", LocalDate.of(2026, 7, 1));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Project created = projectService.create(request);

        assertThat(created.getName()).isEqualTo("QA Platform");
        assertThat(created.getOwner()).isEqualTo("QA Team");
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void update_throwsWhenProjectDoesNotExist() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.update(99L, new ApiModels.ProjectRequest("X", "Y", null)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
    }
}
