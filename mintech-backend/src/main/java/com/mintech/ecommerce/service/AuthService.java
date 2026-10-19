package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.RegisterRequest;
import com.mintech.ecommerce.dto.request.LoginRequest;
import com.mintech.ecommerce.dto.response.UserResponse;
import com.mintech.ecommerce.dto.response.AuthResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}