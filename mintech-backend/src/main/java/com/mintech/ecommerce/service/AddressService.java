package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.AddressRequest;
import com.mintech.ecommerce.dto.response.AddressResponse;

import java.util.UUID;

public interface AddressService {

    AddressResponse createAddress(AddressRequest request);

    AddressResponse getAddressById(UUID id);

    AddressResponse updateAddress(UUID id, AddressRequest request);

    AddressResponse addAddressForUser(String email, AddressRequest request);

    void deleteAddress(UUID id);
}
