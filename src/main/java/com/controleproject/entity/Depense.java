package com.controleproject.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
public class Depense {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private Double montant ;
	@Column(name = "date_depense") 
	private LocalDate dateDepense;
	private String description;
	
    @ManyToOne
    @JoinColumn(name = "tache_id")
    @JsonIgnoreProperties({"projet"})
    private Tache tache;

	
}
