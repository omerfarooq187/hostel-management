package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.ConsumptionExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ConsumptionExpenseRepository
        extends JpaRepository<ConsumptionExpense, Long> {

    @Query("select sum(c.totalCost) from ConsumptionExpense c where c.date = :date")
    Optional<Double> sumTotalCostByDate(@Param("date") LocalDate date);

    @Query("""
    select sum(c.totalCost) 
    from ConsumptionExpense c 
    where month(c.date) = :month 
    and year(c.date) = :year 
    and c.inventory.hostel.id = :hostelId
""")
    Optional<Double> sumMonthlyExpense(
            @Param("month") int month,
            @Param("year") int year,
            @Param("hostelId") Long hostelId
    );

    @Query("""
    select c from ConsumptionExpense c
    where c.date between :start and :end
    and c.inventory.hostel.id = :hostelId
    """)
    List<ConsumptionExpense> findByDateRange(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("hostelId") Long hostelId
    );

}

