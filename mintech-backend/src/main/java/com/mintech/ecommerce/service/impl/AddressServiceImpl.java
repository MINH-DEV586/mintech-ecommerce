package com.mintech.ecommerce.service.impl;

import org.springframework.stereotype.Service;

import com.mintech.ecommerce.repository.AddressRepository;
import com.mintech.ecommerce.dto.response.AddressResponse;
import com.mintech.ecommerce.entity.Address;
import com.mintech.ecommerce.service.AddressService;
import com.mintech.ecommerce.dto.request.AddressRequest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {
    private final AddressRepository addressRepository;

    @Override
    @Transactional
    public AddressResponse createAddress(AddressRequest request) {
        Address address = new Address();
        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDetailAddress(request.getDetailAddress());
        address.setDefault(request.isDefault());
        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse getAddressById(UUID id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));
        return mapToResponse(address);
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(UUID id, AddressRequest request) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));
        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDetailAddress(request.getDetailAddress());
        address.setDefault(request.isDefault());
        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse addAddressForUser(String email, AddressRequest request) {
        Address address = new Address();
        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDetailAddress(request.getDetailAddress());
        address.setDefault(request.isDefault());
        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(UUID id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));
        addressRepository.delete(address);
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .phone(address.getPhone())
                .province(address.getProvince())
                .district(address.getDistrict())
                .ward(address.getWard())
                .detailAddress(address.getDetailAddress())
                .isDefault(address.isDefault())
                .build();
    }
}
