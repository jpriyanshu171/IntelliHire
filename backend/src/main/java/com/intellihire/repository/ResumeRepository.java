package com.intellihire.repository;

import com.intellihire.entity.Resume;
import com.intellihire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Resume entity operations.
 */
@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    Optional<Resume> findByStudent(User student);
    boolean existsByStudent(User student);
}
