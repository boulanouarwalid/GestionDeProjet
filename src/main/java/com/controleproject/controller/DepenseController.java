package com.controleproject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.controleproject.dto.DepenseDTO;
import com.controleproject.entity.Depense;
import com.controleproject.service.DepenseService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/depenses")
@Tag(name = "Depenses", description = "Expense management API")
public class DepenseController {
	@Autowired private DepenseService depenseservice;
	
	@GetMapping
	@Operation(summary = "Get all expenses", description = "Retrieves a list of all expenses")
	@ApiResponse(responseCode = "200", description = "Expenses retrieved successfully")
	public List<Depense> getAllDepenses() {
		return depenseservice.getAllDepenses();
	}
	
	@GetMapping("/tache/{tacheId}")
	@Operation(summary = "Get expenses by task", description = "Retrieves all expenses associated with a specific task")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Expenses retrieved successfully"),
		@ApiResponse(responseCode = "404", description = "Task not found")
	})
	public List<Depense> getDepensesByTache(@PathVariable Long tacheId) {
		return depenseservice.getDepenseByTache(tacheId);
	}
	
	@PostMapping("/create/{tacheId}")
	@Operation(summary = "Create a new expense", description = "Creates a new expense for a specific task")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Expense created successfully"),
		@ApiResponse(responseCode = "400", description = "Invalid input"),
		@ApiResponse(responseCode = "404", description = "Task not found")
	})
	public ResponseEntity<Depense> createDepense (@PathVariable Long tacheId,@Valid @RequestBody DepenseDTO dto){
		return ResponseEntity.ok(depenseservice.createDepense(dto, tacheId));
	}
	@PutMapping("/{depenseId}")
	@Operation(summary = "Update an expense", description = "Modifies an existing expense")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Expense updated successfully"),
		@ApiResponse(responseCode = "400", description = "Invalid input"),
		@ApiResponse(responseCode = "404", description = "Expense not found")
	})
    public ResponseEntity<Depense> modifyDepense(
            @PathVariable Long depenseId, 
            @Valid @RequestBody DepenseDTO dto) {
        return ResponseEntity.ok(depenseservice.modifyDepense(depenseId, dto));
    }
	@DeleteMapping ("/{depenseId}")
	@Operation(summary = "Delete an expense", description = "Deletes an expense by its ID")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Expense deleted successfully"),
		@ApiResponse(responseCode = "404", description = "Expense not found")
	})
	public void deleteDepense(@PathVariable Long depenseId) {
		depenseservice.delete(depenseId);
	}
}
