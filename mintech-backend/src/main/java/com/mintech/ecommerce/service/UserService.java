package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.response.UserResponse;

public interface UserService {

    UserResponse getMe(String email);
}
