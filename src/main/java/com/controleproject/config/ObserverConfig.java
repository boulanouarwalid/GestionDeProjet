package com.controleproject.config;

import com.controleproject.service.IDepenseService;
import com.controleproject.observer.Observer;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class ObserverConfig {

    private final IDepenseService depenseService;
    private final Observer tacheService;

    public ObserverConfig(IDepenseService depenseService, Observer tacheService) {
        this.depenseService = depenseService;
        this.tacheService = tacheService;
    }

    @PostConstruct
    public void initObserverPipeline() {
        depenseService.addObserver(tacheService);
        System.out.println(" Connected Classic Observer Pattern to IDepenseService proxy.");
    }
}
