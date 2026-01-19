package com.intellihire.service;

import com.intellihire.dto.InterviewRequest;
import com.intellihire.dto.InterviewResponse;
import com.intellihire.entity.Application;
import com.intellihire.entity.ApplicationStatus;
import com.intellihire.entity.Interview;
import com.intellihire.entity.InterviewMode;
import com.intellihire.entity.Role;
import com.intellihire.entity.User;
import com.intellihire.repository.ApplicationRepository;
import com.intellihire.repository.InterviewRepository;
import com.intellihire.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing interviews.
 * Only recruiters can schedule interviews for applications.
 */
@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public InterviewService(InterviewRepository interviewRepository,
                           ApplicationRepository applicationRepository,
                           UserRepository userRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Schedule an interview for an application.
     * Only recruiters can schedule interviews.
     */
    @Transactional
    public InterviewResponse scheduleInterview(InterviewRequest request) {
        User recruiter = getCurrentRecruiter();
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        // Verify recruiter owns the job
        if (!application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You can only schedule interviews for your own job postings");
        }

        // Update application status to INTERVIEW
        application.setStatus(ApplicationStatus.INTERVIEW);
        applicationRepository.save(application);

        // Create or update interview
        Interview interview = interviewRepository.findByApplication(application)
                .orElse(Interview.builder().application(application).build());

        interview.setScheduledAt(request.getScheduledAt());
        interview.setMode(InterviewMode.valueOf(request.getMode().toUpperCase()));
        interview.setLocation(request.getLocation());
        interview.setMeetingLink(request.getMeetingLink());
        interview.setNotes(request.getNotes());

        interview = interviewRepository.save(interview);
        return mapToResponse(interview);
    }

    /**
     * Get interview for an application.
     */
    public InterviewResponse getInterviewByApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        Interview interview = interviewRepository.findByApplication(application)
                .orElseThrow(() -> new IllegalStateException("Interview not found"));
        return mapToResponse(interview);
    }

    /**
     * Get all interviews for current student's applications.
     */
    public List<InterviewResponse> getMyInterviews() {
        User student = getCurrentStudent();
        List<Application> applications = applicationRepository.findByStudent(student);
        List<Interview> interviews = applications.stream()
                .flatMap(app -> interviewRepository.findByApplicationOrderByScheduledAtDesc(app).stream())
                .collect(Collectors.toList());
        return interviews.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Get all interviews for recruiter's job postings.
     */
    public List<InterviewResponse> getRecruiterInterviews() {
        User recruiter = getCurrentRecruiter();
        // This would require a more complex query - simplified for now
        // In production, you'd want a proper join query
        return List.of(); // Placeholder
    }

    private InterviewResponse mapToResponse(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());
        response.setApplicationId(interview.getApplication().getId());
        response.setJobTitle(interview.getApplication().getJob().getTitle());
        response.setStudentName(interview.getApplication().getStudent().getFullName());
        response.setStudentEmail(interview.getApplication().getStudent().getEmail());
        response.setScheduledAt(interview.getScheduledAt());
        response.setMode(interview.getMode().name());
        response.setLocation(interview.getLocation());
        response.setMeetingLink(interview.getMeetingLink());
        response.setNotes(interview.getNotes());
        response.setCreatedAt(interview.getCreatedAt());
        response.setUpdatedAt(interview.getUpdatedAt());
        return response;
    }

    private User getCurrentRecruiter() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        if (user.getRole() != Role.RECRUITER) {
            throw new SecurityException("Only recruiters can schedule interviews");
        }
        return user;
    }

    private User getCurrentStudent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        if (user.getRole() != Role.STUDENT) {
            throw new SecurityException("Only students can view their interviews");
        }
        return user;
    }
}
