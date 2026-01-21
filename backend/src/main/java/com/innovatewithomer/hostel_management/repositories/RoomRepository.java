package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHostel_Id(Long hostelId);
    Optional<Room> findByIdAndHostel_Id(Long id, Long hostelId);

    boolean existsByHostelIdAndBlockAndRoomNumber(Long id, String block, String roomNumber);
}
