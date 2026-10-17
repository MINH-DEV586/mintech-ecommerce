package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mintech.ecommerce.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
