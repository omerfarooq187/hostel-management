package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.entities.FeeConfig;
import com.innovatewithomer.hostel_management.entities.Hostel;
import com.innovatewithomer.hostel_management.repositories.FeeConfigRepository;
import jakarta.persistence.EntityManager;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/fee-config")
public class FeeConfigController {

    private final FeeConfigRepository feeConfigRepository;
    private final EntityManager entityManager;

    public FeeConfigController(
            FeeConfigRepository feeConfigRepository,
            EntityManager entityManager
    ) {
        this.feeConfigRepository = feeConfigRepository;
        this.entityManager = entityManager;
    }

    @PostMapping
    public FeeConfig setMonthlyFee(
            @RequestParam Long hostelId,
            @RequestParam double amount,
            @RequestParam int dueDay
    ) {
        Hostel hostel = entityManager.getReference(Hostel.class, hostelId);

        if (dueDay < 1 || dueDay > 28) {
            throw new IllegalArgumentException("Due day must be between 1 and 28");
        }

        // deactivate previous config
        feeConfigRepository.findFirstByHostel_IdAndActiveTrue(hostelId)
                .ifPresent(c -> {
                    c.setActive(false);
                    feeConfigRepository.save(c);
                });

        FeeConfig config = new FeeConfig();
        config.setHostel(hostel);
        config.setMonthlyAmount(amount);
        config.setEffectiveFrom(LocalDate.now());
        config.setDueDay(dueDay);
        config.setActive(true);

        return feeConfigRepository.save(config);
    }

    @GetMapping("/active")
    public FeeConfig getActiveConfig(@RequestParam Long hostelId) {
        return feeConfigRepository
                .findFirstByHostel_IdAndActiveTrue(hostelId)
                .orElse(null);
    }


}
