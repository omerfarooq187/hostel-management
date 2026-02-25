package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.OtherExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OtherExpenseRepository extends JpaRepository<OtherExpense, Long> {
    List<OtherExpense> findByHostel_IdAndDateBetween(Long hostelId, LocalDate start, LocalDate end);

    @Query(
    """
    SELECT SUM(o.amount) FROM OtherExpense o 
        WHERE o.hostel.id = :hostelId AND o.date = :date
    """
    )
    Optional<Double> sumTotalAmountByDate(@Param("hostelId") Long hostelId, @Param("date") LocalDate date);


    @Query("""
       SELECT COALESCE(SUM(o.amount), 0)
       FROM OtherExpense o
       WHERE o.hostel.id = :hostelId
       AND o.date BETWEEN :startDate AND :endDate
       """)
    double sumTotalAmountByDateRange(
            @Param("hostelId") Long hostelId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

}
