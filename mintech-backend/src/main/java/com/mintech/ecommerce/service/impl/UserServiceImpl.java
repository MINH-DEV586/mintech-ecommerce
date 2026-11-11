package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.exception.ResourceNotFoundException;
import com.mintech.ecommerce.dto.request.UserRequest;
import com.mintech.ecommerce.dto.response.UserResponse;
import com.mintech.ecommerce.entity.User;
import com.mintech.ecommerce.repository.UserRepository;
import com.mintech.ecommerce.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public UserResponse getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại: " + email));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String email, UserRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại: " + email));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updatePassword(UUID id, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với ID: " + id));
        user.setPasswordHash(passwordEncoder.encode(password));
        return mapToResponse(userRepository.save(user));
    }

    @Override
    public UserResponse getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với ID: " + id));
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }
}
