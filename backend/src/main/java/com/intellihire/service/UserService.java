package com.intellihire.service;

import com.intellihire.dto.UserProfileDto;
import com.intellihire.entity.User;
import com.intellihire.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileDto getCurrentUserProfile() {
        User user = getCurrentUser();
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        return dto;
    }

    @Transactional
    public UserProfileDto updateCurrentUserProfile(UserProfileDto profileDto) {
        User user = getCurrentUser();
        user.setFullName(profileDto.getFullName());
        userRepository.save(user);
        return getCurrentUserProfile();
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }
}

