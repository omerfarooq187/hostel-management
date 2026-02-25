package com.innovatewithomer.hostel_management.services;

import com.innovatewithomer.hostel_management.config.UserPrincipal;
import com.innovatewithomer.hostel_management.entities.User;
import com.innovatewithomer.hostel_management.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));

        Long hostelId = user.getHostel() != null
                ? user.getHostel().getId()
                : null;

        return new UserPrincipal(
                user.getId(),
                hostelId,
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.isActive()
        );
    }
}
