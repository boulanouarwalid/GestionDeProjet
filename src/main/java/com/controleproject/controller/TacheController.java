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
    @Operation(summary = "Get all tasks", description = "Retrieves a list of all tasks")
    @ApiResponse(responseCode = "200", description = "Tasks retrieved successfully")
    public List<Tache> getAllTaches() {
        return tacheService.getAllTaches();
    }

    @PostMapping("/{projetId}")
    @Operation(summary = "Create a new task", description = "Creates a new task for a specific project")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<Tache> addTache(
            @PathVariable Long projetId, 
            @Valid @RequestBody TacheDTO dto) {
        return ResponseEntity.ok(tacheService.createTache(dto, projetId));
    }

    @GetMapping("/projet/{projetId}")
    @Operation(summary = "Get tasks by project", description = "Retrieves all tasks associated with a specific project")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tasks retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public List<Tache> getTaches(@PathVariable Long projetId) {
        return tacheService.getTachesByProjet(projetId);
    }

    @PutMapping("/{tacheId}")
    @Operation(summary = "Update a task", description = "Modifies an existing task")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<Tache> modifyTache(
            @PathVariable Long tacheId, 
            @Valid @RequestBody TacheDTO dto) {
        return ResponseEntity.ok(tacheService.modifyTache(dto, tacheId));
    }
    @DeleteMapping("/{tacheId}")
    @Operation(summary = "Delete a task", description = "Deletes a task by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public void DeleteTache(@PathVariable Long tacheId) {
    	tacheService.deleteTache(tacheId);
    }
}