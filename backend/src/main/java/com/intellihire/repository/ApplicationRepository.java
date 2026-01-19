package com.intellihire.repository;

import com.intellihire.entity.Application;
import com.intellihire.entity.ApplicationStatus;
import com.intellihire.entity.Job;
import com.intellihire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Application entity operations.
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(User student);
    List<Application> findByJob(Job job);
    List<Application> findByJobAndStatus(Job job, ApplicationStatus status);
    Optional<Application> findByStudentAndJob(User student, Job job);
    long countByJob(Job job);
}

