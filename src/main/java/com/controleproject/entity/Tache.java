package com.controleproject.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class Tache {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private String libelle;
	private LocalDate dateEcheance;
	private String status;
    private String type;
    
    @ManyToOne
    @JoinColumn(name = "projet_id")
    @JsonIgnoreProperties("taches")
    private Projet projet;	

    @OneToMany(mappedBy = "tache", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("tache")
    private List<Depense> depenses;
}
