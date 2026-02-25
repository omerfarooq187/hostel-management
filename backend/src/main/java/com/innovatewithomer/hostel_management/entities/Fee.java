package com.innovatewithomer.hostel_management.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.YearMonth;

@Entity
@Table(name = "fees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    @JoinColumn(comment = "hostel_id", nullable = false)
    private Hostel hostel;

    @Column(nullable = false)
    private String month;
    private double amount;
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private FeeStatus status;
}
