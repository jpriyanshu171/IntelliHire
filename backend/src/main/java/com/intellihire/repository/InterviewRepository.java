package com.intellihire.repository;

import com.intellihire.entity.Application;
import com.intellihire.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Interview entity operations.
 */
@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Optional<Interview> findByApplication(Application application);
    List<Interview> findByApplicationOrderByScheduledAtDesc(Application application);
}
