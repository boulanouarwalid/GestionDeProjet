package com.controleproject.strategy;

import org.springframework.stereotype.Component;

@Component("calculPrudent")
public class CalculPrudentStrategy implements AvancementStrategy {
    // Cette stratégie ajoute 10% de marge de risque au calcul
    @Override
    public double calculer(double prevu, double consomme) {
        if (prevu == 0) return 0;
        return ((consomme * 1.1) / prevu) * 100;
    }
}
