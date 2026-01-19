package com.intellihire.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for updating application status.
 */
@Data
public class ApplicationStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private String status; // APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED

    private String recruiterNotes; // Optional notes from recruiter
}
