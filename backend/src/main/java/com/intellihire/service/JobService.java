package com.intellihire.service;

import com.intellihire.dto.JobRequest;
import com.intellihire.dto.JobResponse;
import com.intellihire.entity.Job;
import com.intellihire.entity.JobStatus;
import com.intellihire.entity.Role;
import com.intellihire.entity.User;
import com.intellihire.repository.ApplicationRepository;
import com.intellihire.repository.JobRepository;
import com.intellihire.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing job postings.
 * Handles job creation, updates, status management, and filtering.
 */
@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository, ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    /**
     * Create a new job posting.
     */
    @Transactional
    public JobResponse createJob(JobRequest request) {
        User recruiter = getCurrentUser();
        if (recruiter.getRole() != Role.RECRUITER) {
            throw new SecurityException("Only recruiters can create jobs");
        }
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .company(request.getCompany())
                .requiredSkills(request.getRequiredSkills())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .status(request.getStatus() != null 
                    ? JobStatus.valueOf(request.getStatus().toUpperCase()) 
                    : JobStatus.DRAFT)
                .recruiter(recruiter)
                .build();
        jobRepository.save(job);
        return mapToResponse(job, false);
    }

    /**
     * Get all active jobs (for students).
     */
    public List<JobResponse> getAllJobs() {
        List<Job> jobs = jobRepository.findByStatus(JobStatus.ACTIVE);
        return jobs.stream()
                .map(job -> mapToResponse(job, false))
                .collect(Collectors.toList());
    }

    /**
     * Get all jobs for current recruiter.
     */
    public List<JobResponse> getMyJobs() {
        User recruiter = getCurrentUser();
        List<Job> jobs = jobRepository.findByRecruiter(recruiter);
        return jobs.stream()
                .map(job -> mapToResponse(job, true)) // Include application count for recruiter
                .collect(Collectors.toList());
    }

    /**
     * Get a specific job by ID.
     */
    public JobResponse getJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        return mapToResponse(job, false);
    }

    /**
     * Update a job posting.
     */
    @Transactional
    public JobResponse updateJob(Long id, JobRequest request) {
        User recruiter = getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You can only update your own jobs");
        }
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setCompany(request.getCompany());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        if (request.getStatus() != null) {
            job.setStatus(JobStatus.valueOf(request.getStatus().toUpperCase()));
        }
        jobRepository.save(job);
        return mapToResponse(job, true);
    }

    /**
     * Delete a job posting.
     */
    @Transactional
    public void deleteJob(Long id) {
        User recruiter = getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You can only delete your own jobs");
        }
        jobRepository.delete(job);
    }

    private JobResponse mapToResponse(Job job, boolean includeStats) {
        JobResponse resp = new JobResponse();
        resp.setId(job.getId());
        resp.setTitle(job.getTitle());
        resp.setDescription(job.getDescription());
        resp.setLocation(job.getLocation());
        resp.setCompany(job.getCompany());
        resp.setStatus(job.getStatus().name());
        resp.setRequiredSkills(job.getRequiredSkills());
        resp.setSalaryMin(job.getSalaryMin());
        resp.setSalaryMax(job.getSalaryMax());
        resp.setCreatedAt(job.getCreatedAt());
        resp.setUpdatedAt(job.getUpdatedAt());
        resp.setRecruiterEmail(job.getRecruiter().getEmail());
        resp.setRecruiterId(job.getRecruiter().getId());
        
        if (includeStats) {
            resp.setApplicationCount(applicationRepository.countByJob(job));
        }
        
        return resp;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }
}

