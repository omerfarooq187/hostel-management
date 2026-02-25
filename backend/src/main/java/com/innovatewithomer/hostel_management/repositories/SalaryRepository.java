package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

public interface SalaryRepository extends JpaRepository<Salary, Long> {
    @Query("""
       SELECT COALESCE(SUM(s.amount),0)
       FROM Salary s
       WHERE s.staff.hostel.id = :hostelId
       AND s.month = :month
       """)
    double totalSalaryExpenseByMonth(
            Long hostelId,
            LocalDate month
    );


    List<Salary> findByStaff_Id(Long staffId);

}
