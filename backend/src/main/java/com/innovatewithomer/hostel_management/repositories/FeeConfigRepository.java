package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.FeeConfig;
import com.innovatewithomer.hostel_management.entities.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface FeeConfigRepository extends JpaRepository<FeeConfig, Long> {

    Optional<FeeConfig> findFirstByHostel_IdAndActiveTrue(Long hostelId);

    FeeConfig findTopByHostelAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(Hostel hostel, LocalDate now);
}
