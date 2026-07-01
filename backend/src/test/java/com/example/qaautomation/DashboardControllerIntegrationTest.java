package com.example.qaautomation;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DashboardControllerIntegrationTest {
    @Autowired
    MockMvc mockMvc;

    @Test
    void getDashboard_returnsAggregatedMetrics() throws Exception {
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTestCases", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.passed", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.failed", greaterThanOrEqualTo(0)));
    }
}
