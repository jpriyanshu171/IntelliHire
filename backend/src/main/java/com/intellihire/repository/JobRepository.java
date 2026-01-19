package com.intellihire.repository;

import com.intellihire.entity.Job;
import com.intellihire.entity.JobStatus;
import com.intellihire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Job entity operations.
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiter(User recruiter);
    List<Job> findByStatus(JobStatus status);
    List<Job> findByRecruiterAndStatus(User recruiter, JobStatus status);
}

