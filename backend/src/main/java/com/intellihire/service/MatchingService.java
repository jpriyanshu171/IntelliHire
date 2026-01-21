package com.intellihire.service;

import com.intellihire.entity.Job;
import com.intellihire.entity.Resume;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service for calculating skill matching scores between resumes and jobs.
 * Uses keyword matching algorithm.
 */
@Service
public class MatchingService {

    /**
     * Calculate matching score between a resume and a job.
     * 
     * @param resume Student's resume
     * @param job Job posting
     * @return Matching score (0-100)
     */
    public int calculateMatchingScore(Resume resume, Job job) {
        if (job.getRequiredSkills() == null || job.getRequiredSkills().isEmpty()) {
            return 50; // Default score if no skills specified
        }

        List<String> resumeSkills = resume.getSkills() != null ? resume.getSkills() : List.of();
        List<String> requiredSkills = job.getRequiredSkills();

        // Normalize skills to lowercase for comparison
        Set<String> resumeSkillsSet = new HashSet<>();
        for (String skill : resumeSkills) {
            resumeSkillsSet.add(skill.toLowerCase().trim());
        }

        Set<String> requiredSkillsSet = new HashSet<>();
        for (String skill : requiredSkills) {
            requiredSkillsSet.add(skill.toLowerCase().trim());
        }

        // Find common skills
        Set<String> commonSkills = new HashSet<>(resumeSkillsSet);
        commonSkills.retainAll(requiredSkillsSet);

        // Calculate score: (matching skills / required skills) * 100
        if (requiredSkillsSet.isEmpty()) {
            return 0;
        }

        double score = ((double) commonSkills.size() / requiredSkillsSet.size()) * 100;
        
        // Cap at 100
        return Math.min(100, (int) Math.round(score));
    }
}
