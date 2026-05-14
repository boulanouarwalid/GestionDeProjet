package com.controleproject.controller;

import java.util.List;

import com.controleproject.dto.InitProjetRequest;
import com.controleproject.facade.ProjetFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.controleproject.dto.ProjetDTO;
import com.controleproject.entity.Projet;
import com.controleproject.service.ProjetService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/projets")
@Tag(name = "Projets", description = "Project management API")
public class ProjetController {
    
    @Autowired private ProjetService projetService;
    @Autowired private ProjetFacade facade;
    @GetMapping
    public List<Projet> getAll() { return projetService.getAllProjets(); }

    @GetMapping("/{id}")
    public ResponseEntity<Projet> getById(@PathVariable Long id) {
        return projetService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Projet create(@Valid @RequestBody ProjetDTO dto) { return projetService.save(dto); }
    @PostMapping("/initialiser")
    public ResponseEntity<Projet> init(@RequestBody InitProjetRequest req) {
        Projet p = facade.initialiserProjet(req.getProjetDTO(), req.getBudgetDTO());
        return ResponseEntity.ok(p);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { projetService.delete(id); }
    @PostMapping("/{id}/cloner")
    public ResponseEntity<Projet> cloner(@PathVariable Long id) {
        Projet clone = projetService.clonerProjet(id);
        return ResponseEntity.ok(clone);
    }
    @PostMapping("/{id}/generer-rapport")
    public ResponseEntity<byte[]> genererRapport(@PathVariable Long id, @RequestParam(defaultValue = "rapportExcelService") String format) {
        byte[] contenu = projetService.genererRapport(id, format);
        String nomFichier = "rapport_" + id + "_" + format + "." + projetService.getExtensionRapport(format);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(projetService.getContentTypeRapport(format)));
        headers.setContentDisposition(ContentDisposition.attachment().filename(nomFichier).build());
        return new ResponseEntity<>(contenu, headers, HttpStatus.OK);
    }
}
