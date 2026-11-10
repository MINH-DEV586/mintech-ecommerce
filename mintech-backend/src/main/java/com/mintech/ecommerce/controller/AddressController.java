package com.mintech.ecommerce.controller;

import org.springframework.web.bind.annotation.RestController;
import com.mintech.ecommerce.service.AddressService;
import com.mintech.ecommerce.dto.response.AddressResponse;
import com.mintech.ecommerce.dto.request.AddressRequest;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@RestController 
@RequestMapping("/api/v1/address")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(Authentication authentication, @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.createAddress(authentication.getName(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(addressService.getAddressById(authentication.getName(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.updateAddress(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication authentication, @PathVariable UUID id) {
        addressService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/user/{email}")
    public ResponseEntity<AddressResponse> addAddressForUser(Authentication authentication, @PathVariable String email,
            @Valid @RequestBody AddressRequest request) {
        if (!authentication.getName().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Bạn chỉ có thể thêm địa chỉ cho tài khoản của mình");
        }
        return createAddress(authentication, request);
    }
}
