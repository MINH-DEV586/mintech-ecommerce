package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.UserRequest;
import com.mintech.ecommerce.dto.response.UserResponse;

public interface UserService {

    UserResponse getMe(String email);

    UserResponse updateProfile(String email, UserRequest request);

    UserResponse updatePassword(Long id, String password);

    UserResponse getById(Long id);
}
