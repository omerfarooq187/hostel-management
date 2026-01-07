package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
//    Optional<Student> findById(Long id);
    Optional<Student> findByUserEmail(String email);
}
