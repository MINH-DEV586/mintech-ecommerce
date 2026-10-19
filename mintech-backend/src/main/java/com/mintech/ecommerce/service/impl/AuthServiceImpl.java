package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.dto.request.RegisterRequest;
import com.mintech.ecommerce.dto.response.UserResponse;
import com.mintech.ecommerce.entity.Role;
import com.mintech.ecommerce.entity.User;
import com.mintech.ecommerce.repository.UserRepository;
import com.mintech.ecommerce.service.AuthService;
import com.mintech.ecommerce.dto.request.LoginRequest;
import com.mintech.ecommerce.dto.response.AuthResponse;
import com.mintech.ecommerce.security.JwtService;

import lombok.RequiredArgsConstructor;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {

        // 1. Kiểm tra email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        // 2. Tạo User
        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();

        response.setId(savedUser.getId());
        response.setFullName(savedUser.getFullName());
        response.setEmail(savedUser.getEmail());
        response.setPhone(savedUser.getPhone());
        response.setRole(savedUser.getRole());
        response.setStatus(savedUser.getStatus());

        return response;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        String email = authentication.getName();
        String token = jwtService.generateToken(email);

        return new AuthResponse(token, "Bearer");
    }
}