package com.innovatewithomer.hostel_management.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "kitchen_inventory")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KitchenInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private double quantity;
    private String unit;
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
