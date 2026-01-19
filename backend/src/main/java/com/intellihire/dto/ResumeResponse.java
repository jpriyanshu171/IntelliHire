package com.intellihire.dto;

import lombok.Data;
import java.time.Instant;
import java.util.List;

/**
 * DTO for resume response.
 */
@Data
public class ResumeResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String filePath;
    private String fileName;
    private String summary;
    private String education; // JSON string
    private List<String> skills;
    private String experience; // JSON string
    private String projects; // JSON string
    private Instant createdAt;
    private Instant updatedAt;
}
