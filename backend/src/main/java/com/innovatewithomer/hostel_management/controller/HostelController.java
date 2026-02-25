package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.entities.Hostel;
import com.innovatewithomer.hostel_management.repositories.HostelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hostels")
public class HostelController {

    private final HostelRepository hostelRepository;

    @Autowired
    public HostelController(HostelRepository hostelRepository) {
        this.hostelRepository = hostelRepository;
    }

    // Get all hostels
    @GetMapping
    public ResponseEntity<List<Hostel>> getAllHostels() {
        List<Hostel> hostels = hostelRepository.findAll();
        return ResponseEntity.ok(hostels);
    }

    // Add new hostel
    @PostMapping
    public ResponseEntity<Hostel> addHostel(@RequestBody Hostel hostel) {
        hostel.setActive(true); // by default active
        Hostel savedHostel = hostelRepository.save(hostel);
        return ResponseEntity.ok(savedHostel);
    }

    // Optional: Activate/Deactivate hostel
    @PatchMapping("/{id}/status")
    public ResponseEntity<Hostel> updateStatus(@PathVariable Long id, @RequestParam boolean active) {
        Hostel hostel = hostelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hostel not found"));
        hostel.setActive(active);
        Hostel updatedHostel = hostelRepository.save(hostel);
        return ResponseEntity.ok(updatedHostel);
    }
}
