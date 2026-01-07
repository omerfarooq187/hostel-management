package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Allocation;
import com.innovatewithomer.hostel_management.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
