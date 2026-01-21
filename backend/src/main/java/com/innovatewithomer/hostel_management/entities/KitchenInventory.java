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
    private Long Id;

    private String itemName;
    private double quantity;
    private String unit;

    @ManyToOne
    @JoinColumn(name = "hostel_id", nullable = false)
    private Hostel hostel;
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
