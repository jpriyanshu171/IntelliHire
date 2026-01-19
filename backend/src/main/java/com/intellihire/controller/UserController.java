package com.intellihire.controller;

import com.intellihire.dto.UserProfileDto;
import com.intellihire.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateProfile(@Valid @RequestBody UserProfileDto profileDto) {
        return ResponseEntity.ok(userService.updateCurrentUserProfile(profileDto));
    }
}

