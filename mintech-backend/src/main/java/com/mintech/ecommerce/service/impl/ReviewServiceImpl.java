package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.dto.request.ReviewRequest;
import com.mintech.ecommerce.dto.response.ReviewResponse;
import com.mintech.ecommerce.entity.OrderItem;
import com.mintech.ecommerce.entity.Product;
import com.mintech.ecommerce.entity.Review;
import com.mintech.ecommerce.entity.Role;
import com.mintech.ecommerce.entity.User;
import com.mintech.ecommerce.repository.OrderItemRepository;
import com.mintech.ecommerce.repository.ProductRepository;
import com.mintech.ecommerce.repository.ReviewRepository;
import com.mintech.ecommerce.repository.UserRepository;
import com.mintech.ecommerce.service.ReviewService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Người dùng không tồn tại với email: " + email));
    }

    @Override
    @Transactional
    public ReviewResponse createReview(String email, ReviewRequest request) {
        User user = getUserByEmail(email);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại với ID: " + request.getProductId()));

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new EntityNotFoundException("Mục đơn hàng không tồn tại"));

        if (!orderItem.getOrder().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Bạn chỉ có thể đánh giá sản phẩm trong đơn hàng của chính mình");
        }

        if (reviewRepository.existsByUserIdAndOrderItemId(user.getId(), orderItem.getId())) {
            throw new IllegalArgumentException("Bạn đã đánh giá sản phẩm này cho đơn hàng này rồi");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .orderItem(orderItem)
                .rating(request.getRating())
                .comment(request.getComment())
                .status("VISIBLE")
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    public List<ReviewResponse> getReviewsByProduct(UUID productId) {
        return reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, "VISIBLE").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getMyReviews(String email) {
        User user = getUserByEmail(email);
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewResponse updateReviewStatus(UUID id, String status) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Đánh giá không tồn tại với ID: " + id));

        review.setStatus(status.toUpperCase());
        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReview(String email, UUID id) {
        User user = getUserByEmail(email);
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Đánh giá không tồn tại với ID: " + id));

        if (!review.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new SecurityException("Bạn không có quyền xóa đánh giá này");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct() != null ? review.getProduct().getId() : null)
                .productName(review.getProduct() != null ? review.getProduct().getName() : null)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .userName(review.getUser() != null ? review.getUser().getFullName() : null)
                .rating(review.getRating())
                .comment(review.getComment())
                .status(review.getStatus())
                .createdAt(review.getCreatedAt())
                .build();
    }
}

