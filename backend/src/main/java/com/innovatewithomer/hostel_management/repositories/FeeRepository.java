package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.Fee;
import com.innovatewithomer.hostel_management.entities.FeeStatus;
import com.innovatewithomer.hostel_management.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {

    List<Fee> findByStudentId(Long studentId);

    List<Fee> findByStatus(FeeStatus status);

    List<Fee> findByHostel_Id(Long hostelId);

    @Query("""
        SELECT f FROM Fee f
        WHERE f.status <> 'PAID'
        AND f.dueDate < CURRENT_DATE
    """)
    List<Fee> findOverdueFees();

    @Query("""
        select COALESCE(SUM(f.amount), 0)
        from Fee f
        where f.hostel.id = :hostelId
            and f.status = com.innovatewithomer.hostel_management.entities.FeeStatus.UNPAID
    """)
    Double getTotalUnpaidAmount(@Param("hostelId") Long hostelId);

    @Query("""
    SELECT COALESCE(SUM(f.amount), 0)
    FROM Fee f
    WHERE f.status = com.innovatewithomer.hostel_management.entities.FeeStatus.PAID
      AND f.student.id = :studentId
    """)
    Double getStudentTotalCollection(@Param("studentId") Long studentId);

    @Query("""
    select coalesce(sum(f.amount), 0)
    from Fee f
    where f.hostel.id = :hostelId
      and f.status = com.innovatewithomer.hostel_management.entities.FeeStatus.PAID
""")
    Double getTotalCollectedByHostel(@Param("hostelId") Long hostelId);


    boolean existsByStudentAndMonth(Student student, String month);
}

