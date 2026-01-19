package com.intellihire.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private long totalJobs;
    private long totalRecruiters;
    private long totalStudents;
    private double successRate;
}
