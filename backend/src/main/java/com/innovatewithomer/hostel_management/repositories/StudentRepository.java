package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Hostel;
import com.innovatewithomer.hostel_management.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByUserEmail(String email);
    List<Student> findAllByHostel_Id(Long hostelId);

//    List<Student> findByHostelAndActiveTrue(Hostel hostel);
}
