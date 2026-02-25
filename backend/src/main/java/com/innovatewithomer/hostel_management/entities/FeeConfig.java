package com.innovatewithomer.hostel_management.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "fee_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeeConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Hostel hostel;

    private double monthlyAmount;

    private LocalDate effectiveFrom;

    private Integer dueDay;

    private boolean active;
}
