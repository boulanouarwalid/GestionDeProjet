package com.controleproject.event;

import lombok.Getter;

public class DepenseCreatedEvent {
    // Getters
    @Getter
    private final double montant;
    @Getter
    private final Long tacheId;

    public DepenseCreatedEvent(double montant, Long tacheId) {
        this.montant = montant;
        this.tacheId = tacheId;
    }
}
