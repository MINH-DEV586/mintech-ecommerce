package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.UserRequest;
import com.mintech.ecommerce.dto.response.UserResponse;

import java.util.UUID;

public interface UserService {

    UserResponse getMe(String email);

    UserResponse updateProfile(String email, UserRequest request);

    UserResponse updatePassword(UUID id, String password);

    UserResponse getById(UUID id);

    java.util.List<UserResponse> getAllUsers();
}
