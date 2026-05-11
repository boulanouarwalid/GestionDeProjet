package com.controleproject.factory;

import com.controleproject.entity.Projet;
import com.controleproject.entity.Tache;
import org.springframework.stereotype.Component;

@Component("dataScience")
public class TacheDataScienceFactory implements TacheFactory {
    public Tache creerTache(String nom, Projet projet) {
        Tache t = new Tache();
        t.setLibelle(nom);
        t.setType("DATA_SCIENCE");
        t.setProjet(projet);
        return t;
    }
}
