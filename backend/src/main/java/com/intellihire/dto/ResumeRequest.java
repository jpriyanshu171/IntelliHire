package com.intellihire.dto;

import lombok.Data;
import java.util.List;

/**
 * DTO for creating/updating a resume.
 * Supports both form-based resume creation and PDF upload.
 */
@Data
public class ResumeRequest {
    private String summary;
    private String education; // JSON string
    private List<String> skills;
    private String experience; // JSON string
    private String projects; // JSON string
    // PDF upload handled separately via multipart/form-data
}
