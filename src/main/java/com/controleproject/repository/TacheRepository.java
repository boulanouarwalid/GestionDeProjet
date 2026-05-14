package com.controleproject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.controleproject.entity.Tache;

@Repository
public interface TacheRepository extends JpaRepository<Tache, Long> {
	List<Tache> findByProjetId(Long projetId);
    
    List<Tache> findByStatus(String statut);
}

