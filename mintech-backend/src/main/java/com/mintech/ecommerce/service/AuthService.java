package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.RegisterRequest;
import com.mintech.ecommerce.dto.reponse.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest registerRequest);
}
