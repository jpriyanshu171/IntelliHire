package com.intellihire.dto;

import com.intellihire.entity.Role;
import lombok.Data;

@Data
public class UserProfileDto {
    private Long id;
    private String email;
    private String fullName;
    private Role role;
}

