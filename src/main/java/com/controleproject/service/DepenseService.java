package com.controleproject.service;


import java.util.List;

import com.controleproject.event.DepenseCreatedEvent;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.controleproject.dto.DepenseDTO;
import com.controleproject.entity.*;
import com.controleproject.repository.*;


@Service
@Transactional
public class DepenseService {
	@Autowired private DepenseRepository depenserepository;
	@Autowired private TacheRepository tacheRepository;
    @Autowired private ApplicationEventPublisher eventPublisher;

    public List<Depense> getAllDepenses() {
        return depenserepository.findAll();
    }

    public Depense createDepense(DepenseDTO dto, Long tacheId) {
        Tache t = tacheRepository.findById(tacheId).orElseThrow();
        Depense d =  new Depense();
        d.setDateDepense(dto.getDateDepense());
        d.setDescription(dto.getDescription());
        d.setMontant(dto.getMontant());
        d.setTache(t);
        eventPublisher.publishEvent(new DepenseCreatedEvent(d.getMontant(), tacheId));
        return depenserepository.save(d);

    }
    
    public List<Depense> getDepenseByTache(Long tacheId) {
        return depenserepository.findByTacheId(tacheId);
    }
    public Depense modifyDepense(Long depenseId, DepenseDTO dto) {
        // 1. Rechercher la dépense existante
        Depense d = depenserepository.findById(depenseId)
                    .orElseThrow(() -> new RuntimeException("Dépense non trouvée"));
        
        // 2. Appliquer les nouvelles valeurs du DTO
        d.setDescription(dto.getDescription());
        d.setMontant(dto.getMontant());        
        // 3. Sauvegarder et retourner
        return depenserepository.save(d);
    }
    public void delete(Long depenseId) {
    	depenserepository.deleteById(depenseId);
    }
}
