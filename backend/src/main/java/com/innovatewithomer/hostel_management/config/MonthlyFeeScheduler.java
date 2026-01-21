package com.innovatewithomer.hostel_management.config;


import com.innovatewithomer.hostel_management.services.FeeGenerationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class MonthlyFeeScheduler {

    private final FeeGenerationService feeGenerationService;

    public MonthlyFeeScheduler(FeeGenerationService feeGenerationService) {
        this.feeGenerationService = feeGenerationService;
    }

    // Run at 00:00 on the 1st of every month
    @Scheduled(cron = "0 0 0 1 * ?")
    public void generateMonthlyFees() {
        System.out.println("Starting monthly fee generation...");
        feeGenerationService.generateMonthlyFees();
        System.out.println("Monthly fees generated successfully.");
    }
}

