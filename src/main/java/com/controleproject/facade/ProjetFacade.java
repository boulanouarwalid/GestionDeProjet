package com.controleproject.facade;

import com.controleproject.dto.BudgetDTO;
import com.controleproject.dto.DepenseDTO;
import com.controleproject.dto.ProjetDTO;
import com.controleproject.dto.TacheDTO;
import com.controleproject.entity.Projet;
import com.controleproject.entity.Tache;
import com.controleproject.service.BudgetService;
import com.controleproject.service.DepenseService;
import com.controleproject.service.ProjetService;
import com.controleproject.service.TacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class ProjetFacade {
    @Autowired private ProjetService projetService;
    @Autowired private BudgetService budgetService;
    @Autowired private TacheService tacheService;
    @Autowired private DepenseService depenseService;

    @Transactional
    public Projet initialiserProjet(ProjetDTO projetDTO, Map<TacheDTO, DepenseDTO> tachesAvecDepenses, BudgetDTO budgetDTO) {
        // Facade pattern : orchestration des services métier au lieu d'accès direct aux repositories.
        Projet p = projetService.save(projetDTO);
        budgetService.createBudget(budgetDTO, p.getId());

        tachesAvecDepenses.forEach((tacheDTO, depenseDTO) -> {
            Tache t = tacheService.createTache(tacheDTO, p.getId());
            if (depenseDTO != null) {
                depenseService.createDepense(depenseDTO, t.getId());
            }
        });

        return p;
    }
}

