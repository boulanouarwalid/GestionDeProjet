package com.controleproject.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class DepenseDTO {
	@Positive
	private Double montant;
	@Size(max=255)
	private String description;
	@NotNull(message = "La date est requise")
	private LocalDate dateDepense;	
}
