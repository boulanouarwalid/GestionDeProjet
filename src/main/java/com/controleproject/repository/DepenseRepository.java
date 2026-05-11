package com.controleproject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.controleproject.entity.Depense;


@Repository
public interface DepenseRepository extends JpaRepository<Depense, Long> {
	 List<Depense> findByTacheId(Long tacheId);
	    
	    // Trouver les dépenses par date (utile pour les rapports mensuels)
	 List<Depense> findByDateDepenseBetween(java.util.Date debut, java.util.Date fin);
}