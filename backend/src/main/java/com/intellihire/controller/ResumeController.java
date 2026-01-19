package com.intellihire.controller;

import com.intellihire.dto.ResumeRequest;
import com.intellihire.dto.ResumeResponse;
import com.intellihire.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Controller for resume management endpoints.
 */
@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Create or update resume (form-based).
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ResumeResponse> createOrUpdateResume(@Valid @RequestBody ResumeRequest request) {
        return ResponseEntity.ok(resumeService.createOrUpdateResume(request));
    }

    /**
     * Upload resume PDF.
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ResumeResponse> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(resumeService.uploadResumePdf(file));
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get current student's resume.
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ResumeResponse> getMyResume() {
        return ResponseEntity.ok(resumeService.getMyResume());
    }

    /**
     * Get resume by student ID (for recruiters).
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ResumeResponse> getResumeByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(resumeService.getResumeByStudentId(studentId));
    }
}
