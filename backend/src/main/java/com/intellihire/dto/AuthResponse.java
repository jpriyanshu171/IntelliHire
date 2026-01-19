package com.intellihire.dto;

import com.intellihire.entity.Role;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private Role role;
}

