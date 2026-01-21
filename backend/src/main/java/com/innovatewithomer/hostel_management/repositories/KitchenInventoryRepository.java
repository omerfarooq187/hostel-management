package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.KitchenInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KitchenInventoryRepository extends JpaRepository<KitchenInventory, Long> {
    Optional<KitchenInventory> findByItemNameIgnoreCaseAndHostelId(String itemName,  Long hostelId);
    List<KitchenInventory> findByItemNameContainingIgnoreCaseAndHostelId(String itemName,  Long hostelId);
    boolean existsByItemNameIgnoreCaseAndHostelId(String itemName, Long hostelId);
}
