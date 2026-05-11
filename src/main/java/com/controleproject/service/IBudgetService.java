package com.controleproject.service;

import com.controleproject.dto.BudgetDTO;
import com.controleproject.entity.Budget;

import java.util.List;

public interface IBudgetService {
    Budget createBudget(BudgetDTO dto, Long projetId);
    List<Budget> getBudgetsByProjet(Long projetId);
}
