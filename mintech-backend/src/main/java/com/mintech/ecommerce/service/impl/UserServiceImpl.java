package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.dto.request.UserRequest;
import com.mintech.ecommerce.dto.response.UserResponse;
import com.mintech.ecommerce.entity.User;
import com.mintech.ecommerce.repository.UserRepository;
import com.mintech.ecommerce.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Người dùng không tồn tại: " + email));

        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String email, UserRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Người dùng không tồn tại: " + email));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setStatus(request.getStatus());
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updatePassword(Long id, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Người dùng không tồn tại với ID: " + id));
        user.setPasswordHash(password);
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
