package com.controleproject.dto;

import lombok.Data;

import java.util.Map;

@Data
public class InitProjetRequest {
        private ProjetDTO projetDTO;
        private BudgetDTO budgetDTO;
        private Map<TacheDTO, DepenseDTO> tachesAvecDepenses;
}

