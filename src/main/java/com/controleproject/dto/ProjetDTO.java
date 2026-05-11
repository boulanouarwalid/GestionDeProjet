package com.controleproject.dto;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjetDTO {
    @NotBlank(message = "Le nom du projet est obligatoire")
    @Size(min=3, message = "Le nom doit avoir au moins 3 caractères")
    private String nomProjet;
}
