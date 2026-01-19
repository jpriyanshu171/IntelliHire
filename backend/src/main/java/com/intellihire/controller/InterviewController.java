package com.intellihire.controller;

import com.intellihire.dto.InterviewRequest;
import com.intellihire.dto.InterviewResponse;
import com.intellihire.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for interview management endpoints.
 */
@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    /**
     * Schedule an interview (recruiter only).
     */
    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<InterviewResponse> scheduleInterview(@Valid @RequestBody InterviewRequest request) {
        return ResponseEntity.ok(interviewService.scheduleInterview(request));
    }

    /**
     * Get interview by application ID.
     */
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<InterviewResponse> getInterviewByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.getInterviewByApplication(applicationId));
    }

    /**
     * Get current student's interviews.
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<InterviewResponse>> getMyInterviews() {
        return ResponseEntity.ok(interviewService.getMyInterviews());
    }
}
