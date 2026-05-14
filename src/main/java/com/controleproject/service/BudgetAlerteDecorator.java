package com.controleproject.service;

import com.controleproject.dto.BudgetDTO;
import com.controleproject.entity.Budget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Primary
public class BudgetAlerteDecorator implements IBudgetService {

    @Autowired
    @Qualifier("baseBudgetService")
    private IBudgetService originalService;

    @Override
    public Budget createBudget(BudgetDTO dto, Long projetId) {
        Budget b = originalService.createBudget(dto, projetId);

        if (b.getMontantPrevu() > 500000) {
            System.out.println(" ALERTE DECORATOR : Un budget très important vient d'être créé !");
        }
        return b;
    }

    @Override
    public List<Budget> getBudgetsByProjet(Long projetId) {
        return originalService.getBudgetsByProjet(projetId);
    }

    @Override
    public Budget modifyBudget(BudgetDTO dto, Long budgetId, Long projetId) {
        Budget b = originalService.modifyBudget(dto, budgetId, projetId);

        if (b.getMontantPrevu() > 500000) {
            System.out.println(" ALERTE DECORATOR : Un budget a été modifié vers un montant critique !");
        }
        return b;
    }

    @Override
    public void deleteBudget(Long budgetId) {
        originalService.deleteBudget(budgetId);
    }

    @Override
    public double getTauxAvancement(Long budgetId) {
        return originalService.getTauxAvancement(budgetId);
    }
}
