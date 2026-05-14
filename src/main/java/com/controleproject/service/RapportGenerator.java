package com.controleproject.service;

import com.controleproject.entity.Budget;
import com.controleproject.entity.Projet;
import com.controleproject.entity.Tache;
import com.controleproject.repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;

public abstract class RapportGenerator {
    @Autowired
    private ProjetRepository projetRepository;

    public final byte[] genererRapportComplet(Long projetId) {
        Projet p = projetRepository.findById(projetId).orElseThrow();
        String data = extraireDonnees(p);
        byte[] fichier = formaterFichier(data, p);
        return fichier;
    }

    private String extraireDonnees(Projet p) {
        StringBuilder sb = new StringBuilder();
        sb.append("Rapport du projet: ").append(p.getNomProjet()).append("\n");
        sb.append("ID: ").append(p.getId()).append("\n");
        sb.append("Taches: ").append(p.getTaches() != null ? p.getTaches().size() : 0).append("\n");
        sb.append("Budgets: ").append(p.getBudgets() != null ? p.getBudgets().size() : 0).append("\n");
        sb.append("---\n");
        if (p.getBudgets() != null) {
            for (Budget b : p.getBudgets()) {
                sb.append("Budget ").append(b.getCategorie()).append(": ")
                  .append(b.getMontantConsomme()).append(" / ").append(b.getMontantPrevu()).append(" MAD\n");
            }
        }
        if (p.getTaches() != null) {
            for (Tache t : p.getTaches()) {
                sb.append("Tache ").append(t.getLibelle()).append(" [").append(t.getStatus()).append("]\n");
            }
        }
        return sb.toString();
    }

    protected abstract byte[] formaterFichier(String data, Projet p);
    public abstract String getExtension();
    public abstract String getContentType();
}

