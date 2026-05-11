package com.controleproject.service;

import com.controleproject.dto.BudgetDTO;
import com.controleproject.entity.Budget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetAlerteDecorator implements IBudgetService {

    @Autowired
    @Qualifier("baseBudgetService") // Il injecte le vrai service
    private IBudgetService originalService;

    @Override
    public Budget createBudget(BudgetDTO dto, Long projetId) {
        // 1. Appel du service original
        Budget b = originalService.createBudget(dto, projetId);

        // 2. Ajout de la fonctionnalité "Décoration" (Alerte)
        if (b.getMontantPrevu() > 500000) {
            System.out.println(" ALERTE DECORATOR : Un budget très important vient d'être créé !");
            // Ici tu pourrais appeler un service SMS ou Email
        }

        return b;
    }

    @Override
    public List<Budget> getBudgetsByProjet(Long projetId) {
        return originalService.getBudgetsByProjet(projetId);
    }
}

