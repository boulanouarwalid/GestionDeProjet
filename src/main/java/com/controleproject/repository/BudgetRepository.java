package com.controleproject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.controleproject.entity.Budget;


@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByProjetId(Long projetId);
    
    // Trouver les budgets par catégorie
    List<Budget> findByCategorie(String categorie);
}

