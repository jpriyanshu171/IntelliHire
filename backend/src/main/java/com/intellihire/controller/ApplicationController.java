package com.intellihire.controller;

import com.intellihire.dto.ApplicationRequest;
import com.intellihire.dto.ApplicationResponse;
import com.intellihire.dto.ApplicationStatusUpdateRequest;
import com.intellihire.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for application management endpoints.
 */
@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Apply to a job (student only).
     */
    @PostMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationResponse> applyToJob(@PathVariable("jobId") Long jobId,
                                                          @Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyToJob(jobId, request));
    }

    /**
     * Get current student's applications.
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getCurrentStudentApplications());
    }

    /**
     * Get applications for a job (recruiter only).
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId));
    }

    /**
     * Update application status (recruiter only).
     */
    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, request));
    }
}

