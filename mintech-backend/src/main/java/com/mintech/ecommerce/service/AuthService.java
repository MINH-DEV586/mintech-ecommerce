package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.RegisterRequest;
import com.mintech.ecommerce.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest registerRequest);
}
