package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequest {

    @Pattern(regexp = "^(PENDING|CONFIRMED|PROCESSING|SHIPPING|DELIVERED|CANCELLED)$",
            message = "Trạng thái đơn hàng phải là một trong: PENDING, CONFIRMED, PROCESSING, SHIPPING, DELIVERED, CANCELLED")
    private String orderStatus;

    @Pattern(regexp = "^(UNPAID|PAID|FAILED|REFUNDED)$",
            message = "Trạng thái thanh toán phải là một trong: UNPAID, PAID, FAILED, REFUNDED")
    private String paymentStatus;
}

