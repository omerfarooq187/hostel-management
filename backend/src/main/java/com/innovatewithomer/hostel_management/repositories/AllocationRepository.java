package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    Optional<Allocation> findByStudentIdAndActiveTrue(Long studentId);
    Optional<Allocation> findByRoomIdAndBedNumberAndActiveTrue(Long roomId, int bedNumber);
    List<Allocation> findByRoomIdAndActiveTrue(Long roomId);
    long countByRoomIdAndActiveTrue(Long roomId);
    List<Allocation> findByRoomIdAndActiveTrueOrderByBedNumber(Long roomId);
    List<Allocation> findByStudentIdOrderByIdDesc(Long studentId);

}
