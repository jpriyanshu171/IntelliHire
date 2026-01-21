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
 */
@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, 
                     UserRepository userRepository, 
                     ApplicationRepository applicationRepository) {
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
                        : JobStatus.ACTIVE)
                .recruiter(recruiter)
                .build();
        jobRepository.save(job);
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

    /**
     * Get all active jobs (for students).
     */
    public List<JobResponse> getAllJobs(String query) {
        List<Job> jobs;
        
        if (query != null && !query.trim().isEmpty()) {
            String lowerQuery = query.toLowerCase().trim();
            System.out.println("Filtering jobs with query: " + lowerQuery);
            
            jobs = jobRepository.findByStatus(JobStatus.ACTIVE).stream()
                .filter(job -> {
                    String jobText = (
                        (job.getTitle() != null ? job.getTitle() : "") + " " + 
                        (job.getDescription() != null ? job.getDescription() : "") + " " + 
                        (job.getCompany() != null ? job.getCompany() : "") + " " + 
                        (job.getLocation() != null ? job.getLocation() : "") + " " + 
                        (job.getRequiredSkills() != null ? String.join(" ", job.getRequiredSkills()) : "")
                    ).toLowerCase();
                    
                    boolean matches = jobText.contains(lowerQuery);
                    if (matches) {
                        System.out.println("Match found: " + job.getTitle());
                    }
                    return matches;
                })
                .collect(Collectors.toList());
                
            System.out.println("Total matches: " + jobs.size());
        } else {
            jobs = jobRepository.findByStatus(JobStatus.ACTIVE);
        }

        return jobs.stream()
                .map(job -> mapToResponse(job, false))
                .collect(Collectors.toList());
    }

    public List<JobResponse> getMyJobs() {
        User recruiter = getCurrentUser();
        List<Job> jobs = jobRepository.findByRecruiter(recruiter);
        return jobs.stream()
                .map(job -> mapToResponse(job, true))
                .collect(Collectors.toList());
    }

    public JobResponse getJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        return mapToResponse(job, false);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private JobResponse mapToResponse(Job job, boolean includeStats) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setLocation(job.getLocation());
        response.setCompany(job.getCompany());
        response.setStatus(job.getStatus().name());
        response.setRequiredSkills(job.getRequiredSkills());
        response.setSalaryMin(job.getSalaryMin());
        response.setSalaryMax(job.getSalaryMax());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());
        
        if (job.getRecruiter() != null) {
            response.setRecruiterEmail(job.getRecruiter().getEmail());
            response.setRecruiterId(job.getRecruiter().getId());
        }

        if (includeStats) {
            long count = applicationRepository.countByJob(job);
            response.setApplicationCount(count);
        }

        return response;
    }
}
