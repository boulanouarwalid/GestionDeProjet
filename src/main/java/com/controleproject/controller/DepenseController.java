package com.controleproject.controller;

import java.util.List;

import com.controleproject.service.IDepenseService;
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
	@Autowired private IDepenseService depenseservice;
	
	@GetMapping
	public List<Depense> getAllDepenses() {
		return depenseservice.getAllDepenses();
	}
	
	@GetMapping("/tache/{tacheId}")
	public List<Depense> getDepensesByTache(@PathVariable Long tacheId) {
		return depenseservice.getDepenseByTache(tacheId);
	}
	
	@PostMapping("/create/{tacheId}")
	public ResponseEntity<Depense> createDepense (@PathVariable Long tacheId,@Valid @RequestBody DepenseDTO dto){
		return ResponseEntity.ok(depenseservice.createDepense(dto, tacheId));
	}
	@PutMapping("/{depenseId}")
    public ResponseEntity<Depense> modifyDepense(
            @PathVariable Long depenseId, 
            @Valid @RequestBody DepenseDTO dto) {
        return ResponseEntity.ok(depenseservice.modifyDepense(depenseId, dto));
    }
	@DeleteMapping ("/{depenseId}")
	public void deleteDepense(@PathVariable Long depenseId) {
		depenseservice.delete(depenseId);
	}
}
