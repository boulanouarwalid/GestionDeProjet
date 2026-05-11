package com.controleproject.strategy;

import org.springframework.stereotype.Component;

@Component("calculSimple")
public class CalculSimpleStrategy implements AvancementStrategy {
    @Override
    public double calculer(double prevu, double consomme) {
        if (prevu == 0) return 0;
        return (consomme / prevu) * 100;
    }
}
