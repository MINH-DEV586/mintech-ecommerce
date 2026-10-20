package com.mintech.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @GetMapping("/me")

    public ResponseEntity<String> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok("Current user: " + authentication.getName());
    }
}
