package com.intellihire.dto;

import lombok.Data;
import java.time.Instant;

/**
 * DTO for application response.
 * Includes status, matching score, and interview information.
 */
@Data
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String location;
    private String status; // APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED
    private Integer matchingScore; // 0-100
    private String coverLetter;
    private String recruiterNotes;
    private Instant createdAt;
    private Instant updatedAt;
    // Student info (for recruiter view)
    private Long studentId;
    private String studentName;
    private String studentEmail;
    // Interview info (if exists)
    private InterviewResponse interview;
}

