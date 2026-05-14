package com.controleproject.service;

import java.util.List;
import java.util.Map;
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
		@Autowired private Map<String, RapportGenerator> rapportsGenerateurs;

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
		public byte[] genererRapport (Long id, String format) {
			String key = format.trim().toLowerCase();
			RapportGenerator gen = rapportsGenerateurs.get(key);
			if (gen == null) {
				throw new RuntimeException("Format de rapport inconnu : " + format + ". Utilisez 'rapportPDFService' ou 'rapportExcelService'.");
			}
			return gen.genererRapportComplet(id);
		}

		public String getExtensionRapport(String format) {
			String key = format.trim().toLowerCase();
			RapportGenerator gen = rapportsGenerateurs.get(key);
			return gen != null ? gen.getExtension() : "txt";
		}

		public String getContentTypeRapport(String format) {
			String key = format.trim().toLowerCase();
			RapportGenerator gen = rapportsGenerateurs.get(key);
			return gen != null ? gen.getContentType() : "text/plain";
		}
		public Projet clonerProjet(Long id) {
			Projet original = projetRepository.findById(id).orElseThrow(() -> new RuntimeException("Projet introuvable"));
			Projet clone = new Projet();
			clone.setNomProjet(original.getNomProjet() + " (Clone)");
			return projetRepository.save(clone);
		}  
};
