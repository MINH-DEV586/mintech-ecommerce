package com.mintech.ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mintech.ecommerce.entity.PayMent;

@Repository
public interface PaymentRepository extends JpaRepository<PayMent, UUID> {
    List<PayMent> findByOrderId(UUID orderId);
}
