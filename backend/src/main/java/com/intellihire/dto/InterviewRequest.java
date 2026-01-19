package com.intellihire.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

/**
 * DTO for creating/updating an interview.
 */
@Data
public class InterviewRequest {
    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Scheduled date/time is required")
    private Instant scheduledAt;

    @NotNull(message = "Interview mode is required")
    private String mode; // ONLINE, OFFLINE, HYBRID

    private String location; // For offline/hybrid
    private String meetingLink; // For online/hybrid
    private String notes;
}
