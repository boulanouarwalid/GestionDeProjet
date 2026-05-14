package com.controleproject.service;

import com.controleproject.entity.Projet;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;

@Service
public class RapportPDFService extends RapportGenerator {
    @Override
    protected byte[] formaterFichier(String data, Projet p) {
        String contenu = """
                =========================================
                        RAPPORT PDF - PROJET
                =========================================
                %s
                =========================================
                Generé le: %s
                =========================================
                """.formatted(data, java.time.LocalDateTime.now().toString());
        return contenu.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public String getExtension() { return "txt"; }

    @Override
    public String getContentType() { return "text/plain"; }
}
