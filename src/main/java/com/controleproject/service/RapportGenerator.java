package com.controleproject.service;

import com.controleproject.entity.Projet;
import com.controleproject.repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

public abstract class RapportGenerator {
    @Autowired
    private ProjetRepository projetRepository;

    public final void genererRapportComplet(Long projetId) {
        Projet p = projetRepository.findById(projetId).orElseThrow();

        System.out.println("1. Extraction des données du projet : " + p.getNomProjet());
        String data = extraireDonnees(p);

        System.out.println("2. Formatage spécifique en cours...");
        formaterFichier(data);

        System.out.println("3. Envoi du rapport au client.");
    }
    private String extraireDonnees(Projet p) {
        return "Données : " + p.getNomProjet() + " avec " + p.getTaches().size() + " tâches.";
    }

    protected abstract void formaterFichier(String data);
}

