package com.mintech.ecommerce.controller;

import com.mintech.ecommerce.dto.request.ChangePasswordRequest;
import com.mintech.ecommerce.dto.request.UserRequest;
import com.mintech.ecommerce.dto.response.UserResponse;
import com.mintech.ecommerce.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication) {
        UserResponse response = userService.getMe(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UserRequest request,
            Authentication authentication) {
        UserResponse response = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        UserResponse response = userService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/password")
    public ResponseEntity<UserResponse> updatePassword(@PathVariable Long id, @Valid @RequestBody ChangePasswordRequest request) {
        UserResponse response = userService.updatePassword(id, request.getPassword());
        return ResponseEntity.ok(response);
    }

}
