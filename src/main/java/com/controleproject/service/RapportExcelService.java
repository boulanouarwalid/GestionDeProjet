package com.controleproject.service;

import org.springframework.stereotype.Service;

@Service
public class RapportExcelService extends RapportGenerator {
    @Override
    protected void formaterFichier(String data) {
        System.out.println(" Conversion des données en cellules Excel (XLSX) : [ " + data + " ]");
    }
}
