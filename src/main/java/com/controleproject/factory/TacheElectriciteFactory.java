package com.controleproject.factory;

import com.controleproject.entity.Projet;
import com.controleproject.entity.Tache;
import org.springframework.stereotype.Component;

@Component("electricite")
public class TacheElectriciteFactory implements TacheFactory {
    public Tache creerTache(String nom, Projet projet) {
        Tache t = new Tache();
        t.setLibelle(nom);
        t.setType("ELECTRICITE");
        t.setProjet(projet);
        return t;
    }
}
