package com.controleproject.service;

import java.util.ArrayList;
import java.util.List;
import com.controleproject.observer.Observer;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;
import com.controleproject.dto.DepenseDTO;
import com.controleproject.entity.*;
import com.controleproject.repository.*;

@Service("depenseServiceTarget")
public class DepenseService implements IDepenseService {
    @Autowired private DepenseRepository depenserepository;
    @Autowired private TacheRepository tacheRepository;
    @Autowired private BudgetRepository  budgetRepository;
    @Autowired private ProjetRepository projetRepository;

    private final List<Observer> observers = new ArrayList<>();

    @Override
    public void addObserver(Observer o) {
        this.observers.add(o);
    }
    @Override
    public void removeObserver(Observer o) {
        this.observers.remove(o);
    }
    private void notifierObservers(double montant, Long tacheId) {
        observers.forEach(o -> o.update(montant, tacheId));
    }

    @Override
    public List<Depense> getAllDepenses() {
        return depenserepository.findAll();
    }

    @Override
    public Depense createDepense(DepenseDTO dto, Long tacheId) {
        Tache t = tacheRepository.findById(tacheId).orElseThrow();
        Projet p = t.getProjet();
        verifierBudgetProjet(p.getId(), dto.getMontant());
        Depense d = new Depense();
        d.setDateDepense(dto.getDateDepense());
        d.setDescription(dto.getDescription());
        d.setMontant(dto.getMontant());
        d.setTache(t);
        Depense saved = depenserepository.save(d);
        notifierObservers(saved.getMontant(), tacheId);
        return saved;
    }

    @Override
    public List<Depense> getDepenseByTache(Long tacheId) {
        return depenserepository.findByTacheId(tacheId);
    }

    @Override
    public Depense modifyDepense(Long depenseId, DepenseDTO dto) {
        Depense d = depenserepository.findById(depenseId)
                .orElseThrow(() -> new RuntimeException("Dépense non trouvée"));
        Tache t = d.getTache();
        verifierBudgetProjet(t.getProjet().getId(), dto.getMontant() - (d.getMontant() != null ? d.getMontant() : 0.0));
        d.setDescription(dto.getDescription());
        d.setMontant(dto.getMontant());
        return depenserepository.save(d);
    }

    @Override
    public void delete(Long depenseId) {
        depenserepository.deleteById(depenseId);
    }

    private void verifierBudgetProjet(Long projetId, double montant) {
        List<Budget> budgets = budgetRepository.findByProjetId(projetId);
        double totalPrevu = budgets.stream().mapToDouble(b -> b.getMontantPrevu() != null ? b.getMontantPrevu() : 0.0).sum();
        double totalConsomme = budgets.stream().mapToDouble(b -> b.getMontantConsomme() != null ? b.getMontantConsomme() : 0.0).sum();
        if (totalConsomme + montant > totalPrevu) {
            throw new RuntimeException("Budget du projet depasse ! Consomme: " + totalConsomme + " / Prevus: " + totalPrevu + ", Operation: " + montant);
        }
    }
}
