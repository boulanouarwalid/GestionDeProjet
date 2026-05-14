package com.controleproject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.controleproject.entity.Projet;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {
	List<Projet> findByNomProjetContaining(String nom);
}

