package com.controleproject.event;

import lombok.Getter;

@Deprecated
public class DepenseCreatedEvent {
    @Getter private final double montant;
    @Getter private final Long tacheId;

    public DepenseCreatedEvent(double montant, Long tacheId) {
        this.montant = montant;
        this.tacheId = tacheId;
    }
}
