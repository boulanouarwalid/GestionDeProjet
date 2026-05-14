package com.controleproject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.controleproject.dto.*;
import com.controleproject.entity.Tache;
import com.controleproject.service.TacheService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/taches")
@Tag(name = "Taches", description = "Task management API")
public class TacheController {
    @Autowired private TacheService tacheService;

    @GetMapping
    public List<Tache> getAllTaches() {
        return tacheService.getAllTaches();
    }

    @PostMapping("/{projetId}")
    public ResponseEntity<Tache> addTache(
            @PathVariable Long projetId, 
            @Valid @RequestBody TacheDTO dto) {
        return ResponseEntity.ok(tacheService.createTache(dto, projetId));
    }

    @GetMapping("/projet/{projetId}")
    public List<Tache> getTaches(@PathVariable Long projetId) {
        return tacheService.getTachesByProjet(projetId);
    }

    @PutMapping("/{tacheId}")
    public ResponseEntity<Tache> modifyTache(
            @PathVariable Long tacheId, 
            @Valid @RequestBody TacheDTO dto) {
        return ResponseEntity.ok(tacheService.modifyTache(dto, tacheId));
    }
    @DeleteMapping("/{tacheId}")
    public void DeleteTache(@PathVariable Long tacheId) {
    	tacheService.deleteTache(tacheId);
    }
}