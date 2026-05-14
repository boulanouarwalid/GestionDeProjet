package com.controleproject.service;

import java.util.List;
import java.util.Map;

import com.controleproject.observer.Observer;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.controleproject.dto.TacheDTO;
import com.controleproject.entity.*;
import com.controleproject.factory.TacheFactory;
import com.controleproject.repository.*;


@Service
@Transactional
public class TacheService implements Observer {
    @Autowired private TacheRepository tacheRepository;
    @Autowired private ProjetRepository projetRepository;
    @Autowired private BudgetRepository budgetRepository;
    @Autowired private Map<String, TacheFactory> tacheFactories;

    public List<Tache> getAllTaches() {
        return tacheRepository.findAll();
    }

    public Tache createTache(TacheDTO dto, Long projetId) {
        Projet p = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable"));

        String type = dto.getType() != null && !dto.getType().isBlank() ? dto.getType() : dto.getType();
        if (type == null || type.isBlank()) {
            throw new RuntimeException("Le type de tâche est obligatoire");
        }

        TacheFactory factory = getFactoryForType(type);
        Tache t = factory.creerTache(dto.getLibelle(), p);
        t.setDateEcheance(dto.getDateEcheance());
        t.setStatus(dto.getStatut());
        return tacheRepository.save(t);
    }

    private TacheFactory getFactoryForType(String type) {
        String key = type.trim().toLowerCase();
        if (key.equals("genie_civil") || key.equals("geniecivil")) {
            return tacheFactories.get("genieCivil");
        }
        if (key.equals("electricite") || key.equals("électricité") || key.equals("electricité")) {
            return tacheFactories.get("electricite");
        }
        if (key.equals("software_engineering") || key.equals("softwareengineering")) {
            return tacheFactories.get("softwareEngineering");
        }
        if (key.equals("cybersecurity") || key.equals("cybersécurité")) {
            return tacheFactories.get("cybersecurity");
        }
        if (key.equals("data_science") || key.equals("datascience")) {
            return tacheFactories.get("dataScience");
        }
        if (key.equals("devops") || key.equals("devops_infrastructure")) {
            return tacheFactories.get("devops");
        }
        throw new RuntimeException("Type de tâche inconnu : " + type);
    }

    public List<Tache> getTachesByProjet(Long projectID) {
        return tacheRepository.findByProjetId(projectID);
    }
    public List<Tache> getTachesByStatus(Long projectID, String status) {
    	return tacheRepository.findByStatus(status);
    }
    public Tache modifyTache(TacheDTO dto , Long TacheId) {
    	Tache t = tacheRepository.findById(TacheId).orElseThrow(() -> new RuntimeException("Tache introuvable"));
        t.setStatus(dto.getStatut());
    	return tacheRepository.save(t);
    }
    public void deleteTache(Long TacheId) {
    	tacheRepository.deleteById(TacheId);
    }
    @Override
    public void update(double montant, Long tacheId) {
        System.out.println("Observer notification received: Tache ID " + tacheId + " incurred " + montant + " MAD expense.");

        Tache tache = tacheRepository.findById(tacheId)
                .orElseThrow(() -> new RuntimeException("Tache introuvable lors de la mise à jour du budget"));

        Long projetId = tache.getProjet().getId();

        Budget budget = budgetRepository.findByProjetId(projetId).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Aucun budget configuré pour ce projet"));

        double currentConsomme = budget.getMontantConsomme() != null ? budget.getMontantConsomme() : 0.0;
        budget.setMontantConsomme(currentConsomme + montant);

        budgetRepository.save(budget);
        System.out.println(" Project Budget updated successfully inside classical Observer.");
    }
}