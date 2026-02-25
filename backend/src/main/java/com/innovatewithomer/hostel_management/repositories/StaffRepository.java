package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByUser_Id(Long userId);

    List<Staff> findByHostel_Id(Long hostelId);

    @Query("SELECT COUNT(s) FROM Staff s WHERE s.hostel.id = :hostelId")
    long countByHostel(@Param("hostelId") Long hostelId);

}
