package com.mintech.ecommerce.controller;

import com.mintech.ecommerce.dto.request.ReviewRequest;
import com.mintech.ecommerce.dto.response.ReviewResponse;
import com.mintech.ecommerce.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Xem danh sách đánh giá công khai của 1 sản phẩm
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // Khách hàng tạo đánh giá mới
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            Authentication authentication,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(authentication.getName(), request));
    }

    // Khách hàng xem các đánh giá của bản thân
    @GetMapping("/my-reviews")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(Authentication authentication) {
        return ResponseEntity.ok(reviewService.getMyReviews(authentication.getName()));
    }

    // Xóa đánh giá (chính chủ hoặc ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            Authentication authentication,
            @PathVariable UUID id) {
        reviewService.deleteReview(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    // ADMIN: Ẩn/Hiện đánh giá
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ReviewResponse> updateReviewStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return ResponseEntity.ok(reviewService.updateReviewStatus(id, status));
    }
}

