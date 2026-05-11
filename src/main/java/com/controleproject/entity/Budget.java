package com.controleproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Double montantPrevu;
    private Double montantConsomme;
    private String categorie;

    @ManyToOne
    @JoinColumn(name = "projet_id")
    @JsonIgnoreProperties({"budgets", "taches"})
    private Projet projet;

}