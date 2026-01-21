package com.innovatewithomer.hostel_management.services;

import com.innovatewithomer.hostel_management.entities.*;
import com.innovatewithomer.hostel_management.repositories.FeeConfigRepository;
import com.innovatewithomer.hostel_management.repositories.FeeRepository;
import com.innovatewithomer.hostel_management.repositories.HostelRepository;
import com.innovatewithomer.hostel_management.repositories.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Slf4j
@Service
public class FeeGenerationService {

    private final HostelRepository hostelRepository;
    private final StudentRepository studentRepository;
    private final FeeRepository feeRepository;
    private final FeeConfigRepository feeConfigRepository;

    public FeeGenerationService(HostelRepository hostelRepository,
                                StudentRepository studentRepository,
                                FeeRepository feeRepository,
                                FeeConfigRepository feeConfigRepository) {
        this.hostelRepository = hostelRepository;
        this.studentRepository = studentRepository;
        this.feeRepository = feeRepository;
        this.feeConfigRepository = feeConfigRepository;
    }

    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void generateMonthlyFees() {

        List<Hostel> hostels = hostelRepository.findAll();

        for (Hostel hostel : hostels) {

            FeeConfig config = feeConfigRepository
                    .findTopByHostelAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(hostel, LocalDate.now());

            if (config == null) continue;

            double amount = config.getMonthlyAmount();
            int dueDay = config.getDueDay();
            YearMonth month = YearMonth.now();

            LocalDate dueDate = month.atDay(
                    Math.min(dueDay, month.lengthOfMonth())
            );


            List<Student> students = studentRepository.findAllByHostel_Id(hostel.getId());

            for (Student student : students) {

                YearMonth currentMonth = YearMonth.now();
                String monthStr = currentMonth.toString();

                boolean exists = feeRepository.existsByStudentAndMonth(student, monthStr);
                if (exists) continue;

                Fee fee = new Fee();
                fee.setStudent(student);
                fee.setAmount(amount);
                fee.setMonth(monthStr);
                fee.setHostel(hostel);
                fee.setDueDate(dueDate);
                fee.setStatus(FeeStatus.UNPAID);
                feeRepository.save(fee);
            }
        }
    }
}
