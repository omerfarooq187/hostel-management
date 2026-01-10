package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.dto.BedStatusDto;
import com.innovatewithomer.hostel_management.dto.RoomStatusResponse;
import com.innovatewithomer.hostel_management.dto.RoomStudentResponse;
import com.innovatewithomer.hostel_management.entities.Allocation;
import com.innovatewithomer.hostel_management.entities.Room;
import com.innovatewithomer.hostel_management.repositories.AllocationRepository;
import com.innovatewithomer.hostel_management.repositories.RoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rooms")
public class RoomController {

    private RoomRepository roomRepository;
    private AllocationRepository allocationRepository;

    public RoomController(RoomRepository roomRepository, AllocationRepository allocationRepository) {
        this.roomRepository = roomRepository;
        this.allocationRepository = allocationRepository;
    }

    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        if (roomRepository.findById(room.getId()).isPresent()) {
            throw new RuntimeException("Room with Block "+room.getBlock()+" and room number" + room.getRoomNumber()+ "already exists");
        }
        return roomRepository.save(room);
    }

    @GetMapping
    public List<Room> getAll() {
        return roomRepository.findAll();
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @GetMapping("/{roomId}/beds")
    public List<BedStatusDto> getRoomBeds(@PathVariable Long roomId) {
        Room room = getRoomById(roomId);

        List<Allocation> allocations =
                allocationRepository.findByRoomIdAndActiveTrue(roomId);

        Map<Integer, Allocation> occupiedMap = new HashMap<>();
        for (Allocation a : allocations) {
            occupiedMap.put(a.getBedNumber(), a);
        }

        List<BedStatusDto> beds = new ArrayList<>();

        for (int i = 1; i <= room.getCapacity(); i++) {
            Allocation allocation = occupiedMap.get(i);
            beds.add(
                    new BedStatusDto(
                            i,
                            allocation != null,
                            allocation
                    )
            );
        }
        return beds;
    }


    @GetMapping("/{roomId}/status")
    public RoomStatusResponse getRoomStatus(@PathVariable Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        long occupied = allocationRepository.countByRoomIdAndActiveTrue(roomId);

        RoomStatusResponse response = new RoomStatusResponse();
        response.setRoomId(roomId);
        response.setBlock(room.getBlock());
        response.setRoomNumber(room.getRoomNumber());
        response.setCapacity(room.getCapacity());
        response.setOccupiedBeds((int) occupied);
        response.setAvailableBeds(room.getCapacity() - (int) occupied);

        return response;
    }

    @GetMapping("/{roomId}/students")
    public List<RoomStudentResponse> getRoomStudents(@PathVariable Long roomId) {

        roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));

        return allocationRepository.findByRoomIdAndActiveTrueOrderByBedNumber(roomId)
                .stream()
                .map(
                        alloc -> {
                            RoomStudentResponse response = new RoomStudentResponse();
                            response.setStudentId(alloc.getStudent().getId());
                            response.setName(alloc.getStudent().getUser().getName());
                            response.setBedNumber(alloc.getBedNumber());

                            return response;
                        }
                )
                .toList();

    }

    @PutMapping("/{roomId}")
    public Room updateRoom(@PathVariable Long roomId, @RequestBody Room request) {
        Room room = getRoomById(roomId);
        room.setCapacity(request.getCapacity());
        room.setBlock(request.getBlock());
        room.setRoomNumber(request.getRoomNumber());
        roomRepository.save(room);
        return room;
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long roomId) {
        Room room = getRoomById(roomId);
        List<Allocation> allocation = allocationRepository.findByRoomIdAndActiveTrue(roomId);
        allocationRepository.deleteAll(allocation);
        roomRepository.delete(room);
        return ResponseEntity.ok("Room with Block "+room.getRoomNumber()+ " has been deleted");
    }
}
