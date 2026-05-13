package com.controleproject.service;

import java.util.ArrayList;
import java.util.List;
import com.controleproject.event.DepenseCreatedEvent;
import com.controleproject.observer.Observer;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.controleproject.dto.DepenseDTO;
import com.controleproject.entity.*;
import com.controleproject.repository.*;

// Name the bean explicitly to avoid conflicts with the proxy bean
@Service("depenseServiceTarget")
public class DepenseService implements IDepenseService {
    @Autowired private DepenseRepository depenserepository;
    @Autowired private TacheRepository tacheRepository;
    @Autowired private ApplicationEventPublisher eventPublisher;

    private final List<Observer> observers = new ArrayList<>();
    // Methods to manage subscribers
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
        Depense d = new Depense();
        d.setDateDepense(dto.getDateDepense());
        d.setDescription(dto.getDescription());
        d.setMontant(dto.getMontant());
        d.setTache(t);
        eventPublisher.publishEvent(new DepenseCreatedEvent(d.getMontant(), tacheId));
        notifierObservers(d.getMontant(), tacheId);
        return depenserepository.save(d);
    }

    @Override
    public List<Depense> getDepenseByTache(Long tacheId) {
        return depenserepository.findByTacheId(tacheId);
    }

    @Override
    public Depense modifyDepense(Long depenseId, DepenseDTO dto) {
        Depense d = depenserepository.findById(depenseId)
                .orElseThrow(() -> new RuntimeException("Dépense non trouvée"));
        d.setDescription(dto.getDescription());
        d.setMontant(dto.getMontant());
        return depenserepository.save(d);
    }

    @Override
    public void delete(Long depenseId) {
        depenserepository.deleteById(depenseId);
    }
}
