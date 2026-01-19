package com.intellihire.entity;

/**
 * Application status enum representing the lifecycle of a job application.
 * Flow: APPLIED → SHORTLISTED → INTERVIEW → SELECTED / REJECTED
 */
public enum ApplicationStatus {
    APPLIED,      // Initial status when student applies
    SHORTLISTED,  // Recruiter shortlisted the candidate
    INTERVIEW,    // Interview scheduled/in progress
    SELECTED,     // Candidate selected for the position
    REJECTED      // Application rejected
}
