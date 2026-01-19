package com.intellihire.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intellihire.dto.ResumeRequest;
import com.intellihire.dto.ResumeResponse;
import com.intellihire.entity.Resume;
import com.intellihire.entity.Role;
import com.intellihire.entity.User;
import com.intellihire.repository.ResumeRepository;
import com.intellihire.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service for managing student resumes.
 * Handles both form-based resume creation and PDF upload.
 */
@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private static final String UPLOAD_DIR = "uploads/resumes/";

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.objectMapper = new ObjectMapper();
        // Create upload directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            // Directory creation failed, will handle during upload
        }
    }

    /**
     * Create or update resume for current student.
     */
    @Transactional
    public ResumeResponse createOrUpdateResume(ResumeRequest request) {
        User student = getCurrentStudent();
        Resume resume = resumeRepository.findByStudent(student)
                .orElse(Resume.builder().student(student).build());

        resume.setSummary(request.getSummary());
        resume.setEducation(request.getEducation());
        resume.setSkills(request.getSkills());
        resume.setExperience(request.getExperience());
        resume.setProjects(request.getProjects());

        resume = resumeRepository.save(resume);
        return mapToResponse(resume);
    }

    /**
     * Upload resume PDF file.
     */
    @Transactional
    public ResumeResponse uploadResumePdf(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        User student = getCurrentStudent();
        Resume resume = resumeRepository.findByStudent(student)
                .orElse(Resume.builder().student(student).build());

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".pdf";
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path uploadPath = Paths.get(UPLOAD_DIR);
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        resume.setFilePath(filePath.toString());
        resume.setFileName(originalFilename);

        resume = resumeRepository.save(resume);
        return mapToResponse(resume);
    }

    /**
     * Get current student's resume.
     */
    public ResumeResponse getMyResume() {
        User student = getCurrentStudent();
        Resume resume = resumeRepository.findByStudent(student)
                .orElseThrow(() -> new IllegalStateException("Resume not found. Please create one first."));
        return mapToResponse(resume);
    }

    /**
     * Get resume by student ID (for recruiters).
     */
    public ResumeResponse getResumeByStudentId(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        Resume resume = resumeRepository.findByStudent(student)
                .orElseThrow(() -> new IllegalStateException("Resume not found"));
        return mapToResponse(resume);
    }

    private ResumeResponse mapToResponse(Resume resume) {
        ResumeResponse response = new ResumeResponse();
        response.setId(resume.getId());
        response.setStudentId(resume.getStudent().getId());
        response.setStudentName(resume.getStudent().getFullName());
        response.setStudentEmail(resume.getStudent().getEmail());
        response.setFilePath(resume.getFilePath());
        response.setFileName(resume.getFileName());
        response.setSummary(resume.getSummary());
        response.setEducation(resume.getEducation());
        response.setSkills(resume.getSkills());
        response.setExperience(resume.getExperience());
        response.setProjects(resume.getProjects());
        response.setCreatedAt(resume.getCreatedAt());
        response.setUpdatedAt(resume.getUpdatedAt());
        return response;
    }

    private User getCurrentStudent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        if (user.getRole() != Role.STUDENT) {
            throw new SecurityException("Only students can manage resumes");
        }
        return user;
    }
}
