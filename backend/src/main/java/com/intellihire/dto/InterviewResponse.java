package com.intellihire.dto;

import lombok.Data;
import java.time.Instant;

/**
 * DTO for interview response.
 */
@Data
public class InterviewResponse {
    private Long id;
    private Long applicationId;
    private String jobTitle;
    private String studentName;
    private String studentEmail;
    private Instant scheduledAt;
    private String mode;
    private String location;
    private String meetingLink;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
}
