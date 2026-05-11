package com.controleproject.service;

import org.springframework.stereotype.Service;

@Service
public class RapportPDFService extends RapportGenerator {
    @Override
    protected void formaterFichier(String data) {
        System.out.println(" Conversion des données en format PDF : [ " + data + " ]");
    }
}
