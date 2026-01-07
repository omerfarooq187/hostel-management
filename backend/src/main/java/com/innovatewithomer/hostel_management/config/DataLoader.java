//package com.innovatewithomer.hostel_management.config;
//
//import com.innovatewithomer.hostel_management.entities.Role;
//import com.innovatewithomer.hostel_management.entities.User;
//import com.innovatewithomer.hostel_management.repositories.UserRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//public class DataLoader {
//
//    @Bean
//    CommandLineRunner loadAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//        return args -> {
//            if (userRepository.findByEmail("admin@hostel.com").isEmpty()) {
//                User admin = new User();
//                admin.setName("Admin");
//                admin.setEmail("admin@hostel.com");
//                admin.setPassword(passwordEncoder.encode("admin123")); // bcrypt encode
//                admin.setRole(Role.ADMIN);
//                admin.setActive(true);
//                userRepository.save(admin);
//            }
//        };
//    }
//}
