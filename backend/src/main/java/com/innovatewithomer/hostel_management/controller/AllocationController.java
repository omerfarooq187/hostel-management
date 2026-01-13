package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.entities.Allocation;
import com.innovatewithomer.hostel_management.entities.Room;
import com.innovatewithomer.hostel_management.entities.Student;
import com.innovatewithomer.hostel_management.repositories.AllocationRepository;
import com.innovatewithomer.hostel_management.repositories.RoomRepository;
import com.innovatewithomer.hostel_management.repositories.StudentRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/allocations")
public class AllocationController {
    private AllocationRepository allocationRepository;
    private RoomRepository roomRepository;
    private StudentRepository studentRepository;

    public AllocationController(AllocationRepository allocationRepository, RoomRepository roomRepository, StudentRepository studentRepository) {
        this.allocationRepository = allocationRepository;
        this.roomRepository = roomRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public Long getAllAllocations() {
        return allocationRepository.countByActiveTrue();
    }

    @GetMapping("/history")
    public List<Allocation> getAllocationHistory() {
        return allocationRepository.findAll();
    }

    @PostMapping("/student/{studentId}/room/{roomId}/bed/{bedNumber}")
    public Allocation allocateRoom(
            @PathVariable Long studentId,
            @PathVariable Long roomId,
            @PathVariable int bedNumber
    ) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(()-> new RuntimeException("Student not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(()-> new RuntimeException("Room not found"));

        if (bedNumber < 1 || bedNumber > room.getCapacity()) {
            throw new RuntimeException("Invalid bed number for this room");
        }

        if (allocationRepository.findByStudentIdAndActiveTrue(studentId).isPresent()) {
            throw new RuntimeException("Student already has an active allocation");
        }

        if (allocationRepository.findByRoomIdAndBedNumberAndActiveTrue(roomId, bedNumber).isPresent()) {
            throw new RuntimeException("Bed already occupied");
        }

        Allocation allocation = new Allocation();
        allocation.setStudent(student);
        allocation.setRoom(room);
        allocation.setBedNumber(bedNumber);
        allocation.setActive(true);

        return allocationRepository.save(allocation);
    }

    @PostMapping("/deallocate/{allocationId}")
    public String deAllocate(@PathVariable Long allocationId) {
        Allocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Allocation not found"));

        allocation.setActive(false);
        allocationRepository.save(allocation);


        return "Room deallocated successfully";
    }

    @GetMapping("/room/{roomId}")
    public List<Allocation> getAllocationsByRoom(@PathVariable Long roomId) {
        return allocationRepository.findByRoomIdAndActiveTrue(roomId);
    }

    @GetMapping("/student/{studentId}")
    public Allocation getStudentAllocation(@PathVariable Long studentId) {
        return allocationRepository.findByStudentIdAndActiveTrue(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @GetMapping("/student/{studentId}/history")
    public List<Allocation> getStudentAllocationHistory(@PathVariable Long studentId) {
        return allocationRepository.findByStudentIdOrderByIdDesc(studentId);
    }


    @PostMapping("/student/{studentId}/room/{roomId}")
    public Allocation autoAllocate(
            @PathVariable Long studentId,
            @PathVariable Long roomId
    ) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (allocationRepository.findByStudentIdAndActiveTrue(studentId).isPresent()) {
            throw new RuntimeException("Student already has a room");
        }

        List<Allocation> activeAllocations = allocationRepository.findByRoomIdAndActiveTrue(roomId);

        if (activeAllocations.size() >= room.getCapacity()) {
            throw new RuntimeException("Room is full");
        }

        boolean[] occupied = new boolean[room.getCapacity() + 1];

        for (Allocation a : activeAllocations) {
            occupied[a.getBedNumber()] = true;
        }

        int freeBed = -1;
        for (int i = 1; i <= room.getCapacity(); i++) {
            if (!occupied[i]) {
                freeBed = i;
                break;
            }
        }

        if (freeBed == -1) {
            throw new RuntimeException("No free bed available");
        }

        Allocation allocation = new Allocation();
        allocation.setStudent(student);
        allocation.setRoom(room);
        allocation.setBedNumber(freeBed);
        allocation.setActive(true);
        return allocationRepository.save(allocation);
    }

    @Transactional
    @PostMapping("/transfer/student/{studentId}/room/{roomId}")
    public Allocation transferRoom(
            @PathVariable Long studentId,
            @PathVariable Long roomId
    ) {
        allocationRepository.findByStudentIdAndActiveTrue(studentId)
                .ifPresent(existing -> {
                    existing.setActive(false);
                    allocationRepository.save(existing);
                });

        return autoAllocate(studentId, roomId);
    }
}
