package com.controleproject.controller;

import java.util.List;

import com.controleproject.service.IBudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.controleproject.dto.BudgetDTO;
import com.controleproject.entity.Budget;
import com.controleproject.service.BudgetService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
@RestController
@RequestMapping("/api/budgets")
@Tag(name = "Budgets", description = "Budget management API")
public class BudgetController {
    @Autowired
    private IBudgetService budgetService;

    @PostMapping("/{projetId}")
    @Operation(summary = "Create a new budget", description = "Creates a new budget for a specific project")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Budget created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<Budget> createBudget(
            @PathVariable Long projetId, 
            @Valid @RequestBody BudgetDTO dto) { // @Valid déclenche la validation
        
        return ResponseEntity.ok(budgetService.createBudget(dto, projetId));
    }
    @PutMapping("/{projetId}/{budgetId}")
    @Operation(summary = "Update an existing budget", description = "Modifies an existing budget for a project")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Budget updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Budget or project not found")
    })
    public ResponseEntity<Budget> modifyBudget(
            @PathVariable Long projetId, @PathVariable Long budgetId, 
            @Valid @RequestBody BudgetDTO dto) { // @Valid déclenche la validation
        
        return ResponseEntity.ok(budgetService.modifyBudget(dto, budgetId,projetId));
    } 
    @GetMapping("/{projetId}")
    @Operation(summary = "Get budgets by project", description = "Retrieves all budgets associated with a specific project")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Budgets retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public List<Budget> getBudgetsByProjet(@PathVariable Long projetId){
    	return budgetService.getBudgetsByProjet(projetId);
    }
    
    @DeleteMapping("/{BudgetId}")
    @Operation(summary = "Delete a budget", description = "Deletes a budget by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Budget deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Budget not found")
    })
    public void deleteBudget(@PathVariable Long BudgetId) {
    	budgetService.deleteBudget(BudgetId);
    }
    @PostMapping("/avancement/{projetId}")
    public ResponseEntity<Double> getTauxAvancement(@PathVariable Long projetId) {
        List<Budget> budgets = budgetService.getBudgetsByProjet(projetId);
        double tauxAvancement = budgets.stream()
                .mapToDouble(b -> budgetService.getTauxAvancement(b.getId()))
                .average()
                .orElse(0.0);
        return ResponseEntity.ok(tauxAvancement);
    }
}