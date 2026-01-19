package com.intellihire.entity;

/**
 * Job posting status enum representing the lifecycle of a job posting.
 * Flow: DRAFT → ACTIVE → CLOSED
 */
public enum JobStatus {
    DRAFT,   // Job is being created/edited, not visible to students
    ACTIVE,  // Job is live and accepting applications
    CLOSED   // Job posting is closed, no longer accepting applications
}
