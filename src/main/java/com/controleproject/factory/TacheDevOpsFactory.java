package com.controleproject.factory;

import com.controleproject.entity.Projet;
import com.controleproject.entity.Tache;
import org.springframework.stereotype.Component;

@Component("devops")
public class TacheDevOpsFactory implements TacheFactory {
    public Tache creerTache(String nom, Projet projet) {
        Tache t = new Tache();
        t.setLibelle(nom);
        t.setType("DEVOPS");
        t.setProjet(projet);
        return t;
    }
}
