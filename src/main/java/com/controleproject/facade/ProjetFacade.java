package com.controleproject.facade;

import com.controleproject.dto.BudgetDTO;
import com.controleproject.dto.ProjetDTO;
import com.controleproject.entity.Projet;
import com.controleproject.service.IBudgetService;
import com.controleproject.service.ProjetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjetFacade {
    @Autowired private ProjetService projetService;
    @Autowired private IBudgetService budgetService;

    @Transactional
    public Projet initialiserProjet(ProjetDTO projetDTO, BudgetDTO budgetDTO) {
        Projet p = projetService.save(projetDTO);
        budgetService.createBudget(budgetDTO, p.getId());
        return p;
    }
}

