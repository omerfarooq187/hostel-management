package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.config.AuthUtil;
import com.innovatewithomer.hostel_management.dto.UserRequest;
import com.innovatewithomer.hostel_management.entities.User;
import com.innovatewithomer.hostel_management.repositories.AllocationRepository;
import com.innovatewithomer.hostel_management.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user/me")
public class UserMeController {

    private final UserRepository userRepository;
    private final AllocationRepository allocationRepository;
    private final AuthUtil authUtil;

    public UserMeController(UserRepository userRepository, AllocationRepository allocationRepository, AuthUtil authUtil) {
        this.userRepository = userRepository;
        this.allocationRepository = allocationRepository;
        this.authUtil = authUtil;
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody UserRequest userRequest) {
        Optional<User> currentUser = userRepository.findByEmail(authUtil.getEmail());

        User user = currentUser.get();
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.getStudent().setPhone(userRequest.getPhone());

        return userRepository.save(user);
    }
}
