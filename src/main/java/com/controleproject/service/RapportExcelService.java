package com.controleproject.service;

import com.controleproject.entity.Budget;
import com.controleproject.entity.Projet;
import com.controleproject.entity.Tache;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;

@Service
public class RapportExcelService extends RapportGenerator {
    @Override
    protected byte[] formaterFichier(String data, Projet p) {
        StringBuilder csv = new StringBuilder();
        csv.append("Rapport du projet: ,").append(p.getNomProjet()).append("\n");
        csv.append("ID: ,").append(p.getId()).append("\n");
        csv.append(",\n");
        csv.append("Budgets\n");
        csv.append("Categorie,Montant Consomme,Montant Prevu\n");
        if (p.getBudgets() != null) {
            for (Budget b : p.getBudgets()) {
                csv.append(b.getCategorie()).append(",")
                   .append(b.getMontantConsomme()).append(",")
                   .append(b.getMontantPrevu()).append("\n");
            }
        }
        csv.append(",\n");
        csv.append("Taches\n");
        csv.append("Libelle,Status\n");
        if (p.getTaches() != null) {
            for (Tache t : p.getTaches()) {
                csv.append(t.getLibelle()).append(",").append(t.getStatus()).append("\n");
            }
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public String getExtension() { return "csv"; }

    @Override
    public String getContentType() { return "text/csv"; }
}
