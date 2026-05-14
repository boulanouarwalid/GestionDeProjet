package com.controleproject.dto;
import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TacheDTO {
    @NotBlank(message = "Le libellé est obligatoire")
    @Size(min = 1, message = "Libellé trop court")
    private String libelle;

    @NotNull(message = "La date d'échéance est requise")
    private LocalDate dateEcheance;

    @NotBlank(message = "Le statut est obligatoire")
    private String statut;

    @NotBlank(message = "Le type de tâche est obligatoire")
    private String type;
}