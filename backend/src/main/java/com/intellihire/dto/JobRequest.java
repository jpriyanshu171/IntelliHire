package com.intellihire.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for creating/updating a job posting.
 */
@Data
public class JobRequest {
    @NotBlank(message = "Job title is required")
    private String title;
    
    @NotBlank(message = "Job description is required")
    private String description;
    
    private String location;
    private String company;
    private String status; // DRAFT, ACTIVE, CLOSED
    private List<String> requiredSkills;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
}

