package com.controleproject.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BudgetDTO {
	@NotNull
    @Positive(message = "Le montant doit être positif")
    private Double montantPrevu;
    
    @NotEmpty(message = "La catégorie est requise")
    private String categorie;

}
