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
public class PurchaseExpense {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private KitchenInventory inventory;

    private double quantity;
    private double pricePerUnit;
    private double totalCost;

    private String supplier;

    private LocalDate date;
    private LocalTime time;

    private String remarks;
}
