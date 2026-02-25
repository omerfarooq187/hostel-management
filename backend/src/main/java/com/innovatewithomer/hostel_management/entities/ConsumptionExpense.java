package com.innovatewithomer.hostel_management.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ConsumptionExpense {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private KitchenInventory inventory;

    private double quantity;
    private double unitCost;
    private double totalCost;

    private String purpose; // Kitchen, Staff, Maintenance

    private LocalDate date;
    private LocalTime time;
    private String dayName;

    private String remarks;
}

