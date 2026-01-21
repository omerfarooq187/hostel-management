package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    Optional<Allocation> findByStudentIdAndStudent_hostel_IdAndActiveTrue(Long studentId, Long hostelId);
    Optional<Allocation> findByStudentId(Long studentId);
    Optional<Allocation> findByRoomIdAndRoom_Hostel_IdAndBedNumberAndActiveTrue(Long roomId, Long hostelId, int bedNumber);
    List<Allocation> findByRoomIdAndActiveTrue(Long roomId);
    long countByRoomIdAndRoom_Hostel_IdAndActiveTrue(Long roomId, Long hostelId);
    long countByRoom_Hostel_IdAndActiveTrue(Long hostelId);
    List<Allocation> findByRoomIdAndRoom_Hostel_IdAndActiveTrueOrderByBedNumber(Long roomId, Long hostelId);
    List<Allocation> findByStudentIdAndStudent_Hostel_IdOrderByIdDesc(Long studentId, Long hostelId);
    List<Allocation> findByStudent_Hostel_IdAndActiveTrue(Long hostelId);
    List<Allocation> findByStudent_Hostel_Id(Long hostelId);
}
