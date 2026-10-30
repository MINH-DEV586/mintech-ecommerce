package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "ID đơn hàng không được để trống")
    private UUID orderId;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod; // COD, VNPAY, MOMO, BANK_TRANSFER

    @NotNull(message = "Số tiền thanh toán không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền thanh toán phải lớn hơn 0")
    private BigDecimal amount;

    private String transactionId; // Mã giao dịch từ cổng thanh toán (nếu có)
}
