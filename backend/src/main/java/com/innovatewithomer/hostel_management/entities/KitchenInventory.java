package com.innovatewithomer.hostel_management.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "kitchen_inventory",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"item_code", "hostel_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KitchenInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_code", nullable = false)
    private String itemCode; // 0001, 0002

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private double quantity;

    @Column(nullable = false)
    private String unit; // kg, pcs

    // NEW
    private double averageCost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_id", nullable = false)
    private Hostel hostel;

    @Column(nullable = false)
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
