package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.config.UserPrincipal;
import com.innovatewithomer.hostel_management.dto.KitchenInventoryDto;
import com.innovatewithomer.hostel_management.dto.KitchenInventoryRequest;
import com.innovatewithomer.hostel_management.entities.Hostel;
import com.innovatewithomer.hostel_management.entities.KitchenInventory;
import com.innovatewithomer.hostel_management.repositories.KitchenInventoryRepository;
import jakarta.persistence.EntityManager;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
public class KitchenInventoryController {
    private final KitchenInventoryRepository kitchenInventoryRepository;
    private final EntityManager entityManager;

    public KitchenInventoryController(KitchenInventoryRepository kitchenInventoryRepository, EntityManager entityManager) {
        this.kitchenInventoryRepository = kitchenInventoryRepository;
        this.entityManager = entityManager;
    }

    @PostMapping
    public ResponseEntity<KitchenInventoryDto> addInventory(@RequestBody KitchenInventoryRequest request, @RequestParam Long hostelId) {
        if (kitchenInventoryRepository.existsByItemNameIgnoreCaseAndHostelId(request.getItemName(), hostelId)) {
            throw new RuntimeException("Item with name " + request.getItemName() + " already exists");
        }

        Hostel hostel = entityManager.getReference(
                Hostel.class,
                hostelId
        );

        KitchenInventory kitchenInventory = new KitchenInventory();
        kitchenInventory.setItemName(request.getItemName());
        kitchenInventory.setQuantity(request.getQuantity());
        kitchenInventory.setUnit(request.getUnit());
        kitchenInventory.setHostel(hostel);
        kitchenInventoryRepository.save(kitchenInventory);

        return ResponseEntity.ok(convertToDto(kitchenInventory));
    }

    @GetMapping("/{itemId}")
    public  ResponseEntity<KitchenInventoryDto> getInventory(@PathVariable Long itemId) {
        KitchenInventory item = kitchenInventoryRepository.findById(itemId)
                .orElseThrow(()-> new RuntimeException("Item not found"));
        return ResponseEntity.ok(convertToDto(item));
    }

    @GetMapping("/search")
    public ResponseEntity<List<KitchenInventoryDto>> getInventoryByItemName(@RequestParam String itemName, @RequestParam Long hostelId) {
        List<KitchenInventoryDto> items = kitchenInventoryRepository
                .findByItemNameContainingIgnoreCaseAndHostelId(itemName, hostelId)
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(items);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<KitchenInventoryDto> updateItem(@PathVariable Long itemId, @RequestBody KitchenInventoryRequest request, @RequestParam Long hostelId) {
        KitchenInventory item = kitchenInventoryRepository.findById(itemId)
                .orElseThrow(()-> new RuntimeException("Item not found"));

        if (!item.getItemName().equalsIgnoreCase(request.getItemName()) &&
                kitchenInventoryRepository.existsByItemNameIgnoreCaseAndHostelId(item.getItemName(), hostelId)) {
            throw new RuntimeException("Item with name " + item.getItemName() + " already exists");
        }

        item.setQuantity(request.getQuantity());
        item.setUnit(request.getUnit());
        kitchenInventoryRepository.save(item);
        return ResponseEntity.ok(convertToDto(item));
    }

    @PatchMapping("/{itemId}/quantity")
    public ResponseEntity<KitchenInventoryDto> updateInventory(@PathVariable Long itemId, @RequestParam double quantity) {
        KitchenInventory item = kitchenInventoryRepository.findById(itemId)
                .orElseThrow(()-> new RuntimeException("Item not found"));

        item.setQuantity(quantity);

        KitchenInventory updatedItem = kitchenInventoryRepository.save(item);
        return ResponseEntity.ok(convertToDto(updatedItem));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemId) {
        KitchenInventory item = kitchenInventoryRepository.findById(itemId)
                .orElseThrow(()-> new RuntimeException("Item not found"));
        kitchenInventoryRepository.delete(item);
        return ResponseEntity.ok("Item with name " + item.getItemName() + " deleted");
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<KitchenInventoryDto>> getLowStockInventory(@RequestParam(defaultValue = "10") double threshold) {
        List<KitchenInventoryDto> lowStockItems = kitchenInventoryRepository.findAll()
                .stream()
                .filter(item-> item.getQuantity() <= threshold)
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(lowStockItems);
    }

    private KitchenInventoryDto convertToDto(KitchenInventory item) {
        return  new KitchenInventoryDto(
                item.getId(),
                item.getItemName(),
                item.getQuantity(),
                item.getUnit(),
                item.getLastUpdated()
        );
    }
}
