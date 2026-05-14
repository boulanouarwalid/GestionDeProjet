package com.controleproject.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.controleproject.dto.ProjetDTO;
import com.controleproject.entity.Projet;
import com.controleproject.repository.ProjetRepository;



@Service
@Transactional
public class ProjetService {
	 	@Autowired private ProjetRepository projetRepository;
		@Autowired private RapportGenerator rapportExcelService;
	    public Projet save(ProjetDTO dto) { 
	    	Projet p= new Projet();
	    	p.setNomProjet(dto.getNomProjet());
	    	return projetRepository.save(p); }
	    public List<Projet> getAllProjets() { return projetRepository.findAll(); }
		public Optional<Projet> getById(Long id) {
	    	return projetRepository.findById(id);
	    }
	    public void delete(Long id){
	    	projetRepository.deleteById(id);
	    }
		public void GenererRapport (Long id){
			rapportExcelService.genererRapportComplet(id);
		}
		public Projet clonerProjet(Long id) {
			Projet original = projetRepository.findById(id).orElseThrow(() -> new RuntimeException("Projet introuvable"));
			Projet clone = new Projet();
			clone.setNomProjet(original.getNomProjet() + " (Clone)");
			return projetRepository.save(clone);
		}  
};
