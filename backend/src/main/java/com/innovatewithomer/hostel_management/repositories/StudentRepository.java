package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByUserEmail(String email);
    List<Student> findAllByHostel_Id(Long hostelId);
    @Query("SELECT COUNT(s) FROM Student s WHERE s.hostel.id = :hostelId")
    long countByHostel(@Param("hostelId") Long hostelId);

    @Query("""
       SELECT s FROM Student s
       WHERE s.user.active = true
       """)
    List<Student> findByActiveTrue();
}
