package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.AddressRequest;
import com.mintech.ecommerce.dto.response.AddressResponse;

import java.util.UUID;

public interface AddressService {

    AddressResponse createAddress(String email, AddressRequest request);

    AddressResponse getAddressById(String email, UUID id);

    AddressResponse updateAddress(String email, UUID id, AddressRequest request);

    void deleteAddress(String email, UUID id);
}
