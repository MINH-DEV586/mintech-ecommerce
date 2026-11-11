package com.mintech.ecommerce;

import com.mintech.ecommerce.entity.ShipMent;
import com.mintech.ecommerce.repository.OrderRepository;
import com.mintech.ecommerce.repository.ShipmentRepository;
import com.mintech.ecommerce.security.JwtService;
import com.mintech.ecommerce.security.LoginRateLimiter;
import com.mintech.ecommerce.service.impl.ShipmentServiceImpl;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityRegressionTests {

    @Test
    void passwordChangeInvalidatesExistingJwt() {
        JwtService jwt = new JwtService();
        ReflectionTestUtils.setField(jwt, "jwtSecret", Base64.getEncoder().encodeToString(new byte[32]));
        ReflectionTestUtils.setField(jwt, "jwtExpiration", 60_000L);

        var claims = jwt.parseToken(jwt.generateToken("buyer@example.com", "old-hash"));

        assertTrue(jwt.matchesCredentials(claims, "old-hash"));
        assertFalse(jwt.matchesCredentials(claims, "new-hash"));
    }

    @Test
    void loginLimitIsEnforcedPerClient() {
        LoginRateLimiter limiter = new LoginRateLimiter();

        for (int attempt = 0; attempt < 10; attempt++) {
            assertTrue(limiter.tryAcquire("192.0.2.1"));
        }
        assertFalse(limiter.tryAcquire("192.0.2.1"));
        assertTrue(limiter.tryAcquire("192.0.2.2"));
    }

    @Test
    void customerCannotReadShipmentsForAnotherOrder() {
        var shipments = mock(ShipmentRepository.class);
        var orders = mock(OrderRepository.class);
        var service = new ShipmentServiceImpl(shipments, orders);
        UUID orderId = UUID.randomUUID();

        var exception = assertThrows(ResponseStatusException.class,
                () -> service.getShipmentsByOrderId(orderId, "other@example.com", false));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(shipments);
    }

    @Test
    void publicTrackingReturnsOnlyCarrierAndStatus() {
        var shipments = mock(ShipmentRepository.class);
        var service = new ShipmentServiceImpl(shipments, mock(OrderRepository.class));
        when(shipments.findByTrackingNumber("tracking-code")).thenReturn(Optional.of(
                ShipMent.builder().carrier("GHN").status("SHIPPING").build()));

        var tracking = service.getShipmentByTrackingNumber("tracking-code");

        assertEquals("GHN", tracking.carrier());
        assertEquals("SHIPPING", tracking.status());
    }
}
