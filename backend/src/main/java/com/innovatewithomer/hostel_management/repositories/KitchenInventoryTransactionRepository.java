package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.KitchenInventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface KitchenInventoryTransactionRepository extends JpaRepository<KitchenInventoryTransaction, Long> {
    List<KitchenInventoryTransaction>
    findByDate(LocalDate date);

    List<KitchenInventoryTransaction>
    findByInventory_Id(Long inventoryId);

    List<KitchenInventoryTransaction> findByDateAndInventory_Hostel_Id(LocalDate parse, Long hostelId);

}
