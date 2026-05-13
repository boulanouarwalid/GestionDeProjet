package com.controleproject.service;

public class ProjetServiceSing {
    private static final ProjetService INSTANCE = new ProjetService();
    private void ProjetService() {}
    public static ProjetService getInstance() { return INSTANCE; }
}
