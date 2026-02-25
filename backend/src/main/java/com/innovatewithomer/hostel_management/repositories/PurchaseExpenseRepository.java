package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.PurchaseExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PurchaseExpenseRepository
        extends JpaRepository<PurchaseExpense, Long> {

    @Query("select sum(p.totalCost) from PurchaseExpense p where p.date = :date")
    Optional<Double> sumTotalCostByDate(@Param("date") LocalDate date);

    @Query("""
    select p from PurchaseExpense p
    where p.date between :start and :end
    and p.inventory.hostel.id = :hostelId
    """)
    List<PurchaseExpense> findByDateRange(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("hostelId") Long hostelId
    );

    @Query("""
       SELECT COALESCE(SUM(p.totalCost),0)
       FROM PurchaseExpense p
       WHERE p.inventory.hostel.id = :hostelId
       AND p.date BETWEEN :startDate AND :endDate
       """)
    double totalInventoryExpenseByDateRange(
            Long hostelId,
            LocalDate startDate,
            LocalDate endDate
    );

}

