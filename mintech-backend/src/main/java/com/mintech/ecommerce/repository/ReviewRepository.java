package com.mintech.ecommerce.repository;

import com.mintech.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProductIdAndStatusOrderByCreatedAtDesc(UUID productId, String status);
    List<Review> findByProductIdOrderByCreatedAtDesc(UUID productId);
    List<Review> findByUserIdOrderByCreatedAtDesc(UUID userId);
    boolean existsByUserIdAndOrderItemId(UUID userId, UUID orderItemId);
}

