package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostelRepository extends JpaRepository<Hostel, Long> {
}
