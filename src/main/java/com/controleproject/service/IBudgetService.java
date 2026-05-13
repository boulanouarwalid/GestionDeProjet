package com.controleproject.service;

import java.util.List;
import com.controleproject.dto.BudgetDTO;
import com.controleproject.entity.Budget;

public interface IBudgetService {
    Budget createBudget(BudgetDTO dto, Long projetId);
    List<Budget> getBudgetsByProjet(Long projetId);
    Budget modifyBudget(BudgetDTO dto, Long budgetId, Long projetId);
    void deleteBudget(Long budgetId);
    double getTauxAvancement(Long budgetId);
}
