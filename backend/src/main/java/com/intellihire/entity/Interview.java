package com.intellihire.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * Interview entity storing interview scheduling information.
 * Linked to an application and contains scheduling details.
 */
@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt; // Interview date and time

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewMode mode; // ONLINE, OFFLINE, or HYBRID

    @Column(length = 255)
    private String location; // For offline/hybrid interviews

    @Column(name = "meeting_link", length = 500)
    private String meetingLink; // For online/hybrid interviews

    @Column(columnDefinition = "TEXT")
    private String notes; // Additional interview notes

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
