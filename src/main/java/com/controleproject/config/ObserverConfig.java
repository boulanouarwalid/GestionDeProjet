package com.controleproject.config;

import com.controleproject.service.IDepenseService;
import com.controleproject.observer.Observer;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class ObserverConfig {

    private final IDepenseService depenseService;
    private final Observer tacheService; // TacheService implements Observer

    // Spring resolves both beans automatically through IoC container injection
    public ObserverConfig(IDepenseService depenseService, Observer tacheService) {
        this.depenseService = depenseService;
        this.tacheService = tacheService;
    }

    @PostConstruct
    public void initObserverPipeline() {
        // Registers TacheService into the proxy-wrapped target pipeline directly
        depenseService.addObserver(tacheService);
        System.out.println(" Connected Classic Observer Pattern to IDepenseService proxy.");
    }
}
