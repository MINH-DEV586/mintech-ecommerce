package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.AddressRequest;
import com.mintech.ecommerce.dto.response.AddressResponse;

public interface AddressService {

    AddressResponse createAddress(AddressRequest request);

    AddressResponse getAddressById(Long id);

}
