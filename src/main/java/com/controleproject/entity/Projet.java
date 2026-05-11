package com.controleproject.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Projet implements Cloneable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nomProjet;
    
    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("projet")
    private List<Budget> budgets;
    
    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("projet")
    private List<Tache> taches;
    @Override
    public Projet clone() {
        try {
            Projet copie = (Projet) super.clone();
            copie.setId(null);            // nouveau ID en base
            copie.setTaches(null);         // à réassigner
            copie.setBudgets(null);         // à réassigner
            return copie;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }
}