package com.intellihire.repository;

import com.intellihire.entity.Role;
import com.intellihire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'RECRUITER'")
    long countRecruiters();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT'")
    long countStudents();
}

