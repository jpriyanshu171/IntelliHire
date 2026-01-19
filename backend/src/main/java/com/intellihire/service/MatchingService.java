package com.intellihire.service;

import com.intellihire.entity.Job;
import com.intellihire.entity.Resume;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service for calculating skill matching scores between resumes and jobs.
 * This implements the "AI-driven matching" logic mentioned in the project description.
 * 
 * Algorithm:
 * 1. Extract skills from resume and required skills from job
 * 2. Calculate intersection (common skills)
 * 3. Score = (common skills / required skills) * 100
 * 4. Bonus points for exact matches (case-insensitive)
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

    /**
     * Calculate matching score from skill lists directly.
     * 
     * @param studentSkills Student's skills
     * @param requiredSkills Job's required skills
     * @return Matching score (0-100)
     */
    public int calculateMatchingScore(List<String> studentSkills, List<String> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return 50;
        }

        Set<String> studentSkillsSet = new HashSet<>();
        for (String skill : studentSkills) {
            studentSkillsSet.add(skill.toLowerCase().trim());
        }

        Set<String> requiredSkillsSet = new HashSet<>();
        for (String skill : requiredSkills) {
            requiredSkillsSet.add(skill.toLowerCase().trim());
        }

        Set<String> commonSkills = new HashSet<>(studentSkillsSet);
        commonSkills.retainAll(requiredSkillsSet);

        if (requiredSkillsSet.isEmpty()) {
            return 0;
        }

        double score = ((double) commonSkills.size() / requiredSkillsSet.size()) * 100;
        return Math.min(100, (int) Math.round(score));
    }
}
