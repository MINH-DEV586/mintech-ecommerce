package com.mintech.ecommerce.repository;

import com.mintech.ecommerce.entity.ShipMent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShipmentRepository extends JpaRepository<ShipMent, UUID> {
    List<ShipMent> findByOrderId(UUID orderId);
    Optional<ShipMent> findByTrackingNumber(String trackingNumber);
}

