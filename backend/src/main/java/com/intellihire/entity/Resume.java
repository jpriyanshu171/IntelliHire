package com.intellihire.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

/**
 * Resume entity storing student resume information.
 * Supports both form-based resume creation and PDF upload.
 */
@Entity
@Table(name = "resumes", uniqueConstraints = @UniqueConstraint(columnNames = "student_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private User student;

    // PDF upload fields
    @Column(name = "file_path", length = 500)
    private String filePath; // Path to uploaded PDF file

    @Column(name = "file_name")
    private String fileName;

    // Form-based resume fields
    @Column(columnDefinition = "TEXT")
    private String summary;

    // JSONB fields for structured data (PostgreSQL specific)
    @Column(columnDefinition = "jsonb")
    private String education; // JSON array of education entries

    @ElementCollection
    @CollectionTable(name = "resume_skills", joinColumns = @JoinColumn(name = "resume_id"))
    @Column(name = "skill")
    private List<String> skills; // Array of skills

    @Column(columnDefinition = "jsonb")
    private String experience; // JSON array of work experience entries

    @Column(columnDefinition = "jsonb")
    private String projects; // JSON array of project entries

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
