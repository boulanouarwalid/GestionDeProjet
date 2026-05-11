package com.controleproject.service;

import java.util.List;

import com.controleproject.strategy.AvancementStrategy;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.controleproject.dto.BudgetDTO;
import com.controleproject.entity.*;
import com.controleproject.repository.*;



@Service("baseBudgetService")
@Transactional
@Primary
public class BudgetService implements IBudgetService {
	
	@Autowired private BudgetRepository budgetRepository;
    @Autowired private ProjetRepository projetRepository;
    
    private static final double LIMITE_BUDGET = 1000000.0;

    public  Budget createBudget(BudgetDTO dto, Long projetId) {
        Projet p = projetRepository.findById(projetId).orElseThrow();
        double totalProjet = budgetRepository.findByProjetId(projetId).stream()
                .mapToDouble(Budget::getMontantPrevu).sum();
                
		if (totalProjet + dto.getMontantPrevu() > LIMITE_BUDGET) {
		throw new RuntimeException("Budget global dépassé ! La limite est de " + LIMITE_BUDGET + " MAD.");
		}
		
		Budget b = new Budget();
		if (dto.getMontantPrevu() <= 0) {
			throw new RuntimeException ("le montantPrevu doit être supérieur à 0.");
		}
		b.setMontantPrevu(dto.getMontantPrevu());
		b.setCategorie(dto.getCategorie());
		b.setProjet(p);
		
		return budgetRepository.save(b); 
    }

    public List<Budget> getBudgetsByProjet(Long projetId) {
        return budgetRepository.findByProjetId(projetId);
    }
    
    public Budget modifyBudget(BudgetDTO dto,Long budgetId ,Long projetId) {
       Budget b = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget non trouvé"));
                
       double totalProjet = budgetRepository.findByProjetId(projetId).stream()
               .mapToDouble(Budget::getMontantPrevu).sum();
               
       // Soustraire l'ancien montant avant d'ajouter le nouveau pour vérifier la limite
       double oldMontant = b.getMontantPrevu() != null ? b.getMontantPrevu() : 0.0;
       double nouveauTotal = (totalProjet - oldMontant) + dto.getMontantPrevu();
       
       if (nouveauTotal > LIMITE_BUDGET) {
   		throw new RuntimeException("Budget global dépassé ! Le nouveau total serait " + nouveauTotal + " MAD (Limite: " + LIMITE_BUDGET + " MAD).");
   		}
   		
   		if (dto.getMontantPrevu() <= 0) {
   			throw new RuntimeException ("le montantPrevu doit être supérieur à 0.");
   		}
   		b.setMontantPrevu(dto.getMontantPrevu());
       return budgetRepository.save(b);
      }
    public void deleteBudget(Long BudgetId) {
    	budgetRepository.deleteById(BudgetId);
    }


	// Stratégie patteern 
	@Autowired
	@Qualifier("calculSimple")
	private AvancementStrategy avancementStrategy;

	public double getTauxAvancement(Long budgetId) {
		Budget b = budgetRepository.findById(budgetId).orElseThrow();

		// Utilisation de la stratégie avec vérification de null
        double prevu = b.getMontantPrevu() != null ? b.getMontantPrevu() : 0.0;
        double consomme = b.getMontantConsomme() != null ? b.getMontantConsomme() : 0.0;
		return avancementStrategy.calculer(prevu, consomme);
	}
}
