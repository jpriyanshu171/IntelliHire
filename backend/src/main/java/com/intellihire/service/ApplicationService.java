package com.intellihire.service;

import com.intellihire.dto.ApplicationRequest;
import com.intellihire.dto.ApplicationResponse;
import com.intellihire.dto.ApplicationStatusUpdateRequest;
import com.intellihire.dto.InterviewResponse;
import com.intellihire.entity.Application;
import com.intellihire.entity.ApplicationStatus;
import com.intellihire.entity.Interview;
import com.intellihire.entity.Job;
import com.intellihire.entity.JobStatus;
import com.intellihire.entity.Resume;
import com.intellihire.entity.Role;
import com.intellihire.entity.User;
import com.intellihire.repository.ApplicationRepository;
import com.intellihire.repository.InterviewRepository;
import com.intellihire.repository.JobRepository;
import com.intellihire.repository.ResumeRepository;
import com.intellihire.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing job applications.
 * Handles application creation, status updates, and matching score calculation.
 */
@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final InterviewRepository interviewRepository;
    private final MatchingService matchingService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              ResumeRepository resumeRepository,
                              InterviewRepository interviewRepository,
                              MatchingService matchingService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.interviewRepository = interviewRepository;
        this.matchingService = matchingService;
    }

    /**
     * Apply to a job. Calculates matching score automatically.
     */
    @Transactional
    public ApplicationResponse applyToJob(Long jobId, ApplicationRequest request) {
        User student = getCurrentUser();
        if (student.getRole() != Role.STUDENT) {
            throw new SecurityException("Only students can apply for jobs");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        // Check if job is active
        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalStateException("This job is not currently accepting applications");
        }

        applicationRepository.findByStudentAndJob(student, job)
                .ifPresent(a -> {
                    throw new IllegalStateException("Already applied to this job");
                });

        // Calculate matching score
        int matchingScore = 0;
        Resume resume = resumeRepository.findByStudent(student).orElse(null);
        if (resume != null && job.getRequiredSkills() != null && !job.getRequiredSkills().isEmpty()) {
            matchingScore = matchingService.calculateMatchingScore(resume, job);
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.APPLIED)
                .matchingScore(matchingScore)
                .build();
        applicationRepository.save(application);
        return mapToResponse(application, false);
    }

    /**
     * Get current student's applications.
     */
    public List<ApplicationResponse> getCurrentStudentApplications() {
        User student = getCurrentUser();
        List<Application> applications = applicationRepository.findByStudent(student);
        return applications.stream()
                .map(app -> mapToResponse(app, true)) // Include interview info for students
                .collect(Collectors.toList());
    }

    /**
     * Get applications for a job (recruiter view).
     */
    public List<ApplicationResponse> getApplicationsForJob(Long jobId) {
        User recruiter = getCurrentRecruiter();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        // Verify recruiter owns the job
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You can only view applications for your own job postings");
        }

        List<Application> applications = applicationRepository.findByJob(job);
        return applications.stream()
                .map(app -> mapToResponse(app, false))
                .collect(Collectors.toList());
    }

    /**
     * Update application status (recruiter only).
     */
    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest request) {
        User recruiter = getCurrentRecruiter();
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        // Verify recruiter owns the job
        if (!application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You can only update applications for your own job postings");
        }

        application.setStatus(ApplicationStatus.valueOf(request.getStatus().toUpperCase()));
        if (request.getRecruiterNotes() != null) {
            application.setRecruiterNotes(request.getRecruiterNotes());
        }
        applicationRepository.save(application);
        return mapToResponse(application, false);
    }

    private ApplicationResponse mapToResponse(Application application, boolean includeInterview) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(application.getId());
        resp.setJobId(application.getJob().getId());
        resp.setJobTitle(application.getJob().getTitle());
        resp.setCompany(application.getJob().getCompany());
        resp.setLocation(application.getJob().getLocation());
        resp.setStatus(application.getStatus().name());
        resp.setMatchingScore(application.getMatchingScore());
        resp.setCoverLetter(application.getCoverLetter());
        resp.setRecruiterNotes(application.getRecruiterNotes());
        resp.setCreatedAt(application.getCreatedAt());
        resp.setUpdatedAt(application.getUpdatedAt());
        resp.setStudentId(application.getStudent().getId());
        resp.setStudentName(application.getStudent().getFullName());
        resp.setStudentEmail(application.getStudent().getEmail());

        // Include interview info if requested
        if (includeInterview) {
            try {
                Interview interview = interviewRepository.findByApplication(application).orElse(null);
                if (interview != null) {
                    InterviewResponse interviewResp = new InterviewResponse();
                    interviewResp.setId(interview.getId());
                    interviewResp.setApplicationId(interview.getApplication().getId());
                    interviewResp.setJobTitle(interview.getApplication().getJob().getTitle());
                    interviewResp.setStudentName(interview.getApplication().getStudent().getFullName());
                    interviewResp.setStudentEmail(interview.getApplication().getStudent().getEmail());
                    interviewResp.setScheduledAt(interview.getScheduledAt());
                    interviewResp.setMode(interview.getMode().name());
                    interviewResp.setLocation(interview.getLocation());
                    interviewResp.setMeetingLink(interview.getMeetingLink());
                    interviewResp.setNotes(interview.getNotes());
                    interviewResp.setCreatedAt(interview.getCreatedAt());
                    interviewResp.setUpdatedAt(interview.getUpdatedAt());
                    resp.setInterview(interviewResp);
                }
            } catch (Exception e) {
                // Interview not found, that's okay
            }
        }

        return resp;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }

    private User getCurrentRecruiter() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        if (user.getRole() != Role.RECRUITER) {
            throw new SecurityException("Only recruiters can perform this action");
        }
        return user;
    }
}

