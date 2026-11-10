package com.mintech.ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mintech.ecommerce.entity.PayMent;

@Repository
public interface PaymentRepository extends JpaRepository<PayMent, UUID> {
    List<PayMent> findByOrderId(UUID orderId);

    Optional<PayMent> findByIdAndOrderUserEmail(UUID id, String email);

    Optional<PayMent> findFirstByOrderIdAndPaymentMethodAndStatusOrderByPaymentDateDesc(
            UUID orderId, String paymentMethod, String status);
}
