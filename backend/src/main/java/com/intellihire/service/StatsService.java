package com.intellihire.service;

import com.intellihire.dto.StatsResponse;
import com.intellihire.entity.Role;
import com.intellihire.repository.ApplicationRepository;
import com.intellihire.repository.JobRepository;
import com.intellihire.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public StatsService(JobRepository jobRepository,
                       UserRepository userRepository,
                       ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    public StatsResponse getStats() {
        long totalJobs = jobRepository.count();
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        
        // Calculate success rate (applications / students * 100, capped at 100%)
        long totalApplications = applicationRepository.count();
        double successRate = totalStudents > 0 
            ? Math.min(100.0, (totalApplications * 100.0) / totalStudents)
            : 0.0;
        
        // Round to 2 decimal places
        successRate = Math.round(successRate * 100.0) / 100.0;
        
        return new StatsResponse(totalJobs, totalRecruiters, totalStudents, successRate);
    }
}
