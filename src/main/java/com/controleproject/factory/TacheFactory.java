package com.controleproject.factory;

import com.controleproject.entity.Projet;
import com.controleproject.entity.Tache;
import org.springframework.stereotype.Component;

public interface TacheFactory {
    Tache creerTache(String nom, Projet projet);
}