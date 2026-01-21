package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndStudent_Hostel_Id(String email, Long hostelId);
}
