package com.intellihire.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * DTO for job response.
 * Includes status, skills, and salary information.
 */
@Data
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String company;
    private String status; // DRAFT, ACTIVE, CLOSED
    private List<String> requiredSkills;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private Instant createdAt;
    private Instant updatedAt;
    private String recruiterEmail;
    private Long recruiterId;
    // Statistics (for recruiter view)
    private Long applicationCount;
}

