package com.controleproject.strategy;

import org.springframework.stereotype.Component;

@Component("calculPrudent")
public class CalculPrudentStrategy implements AvancementStrategy {
    @Override
    public double calculer(double prevu, double consomme) {
        if (prevu == 0) return 0;
        return ((consomme * 1.1) / prevu) * 100;
    }
}
