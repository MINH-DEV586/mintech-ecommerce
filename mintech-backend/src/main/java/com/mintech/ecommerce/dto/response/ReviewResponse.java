package com.mintech.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private UUID id;
    private UUID productId;
    private String productName;
    private UUID userId;
    private String userName;
    private Integer rating;
    private String comment;
    private String status;
    private LocalDateTime createdAt;
}

