package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.ReviewRequest;
import com.mintech.ecommerce.dto.response.ReviewResponse;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    ReviewResponse createReview(String email, ReviewRequest request);
    List<ReviewResponse> getReviewsByProduct(UUID productId);
    List<ReviewResponse> getMyReviews(String email);
    ReviewResponse updateReviewStatus(UUID id, String status);
    void deleteReview(String email, UUID id);
}

