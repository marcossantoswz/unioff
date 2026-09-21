package com.unioff.controller;

import com.unioff.dto.BeneficioResponseDTO;
import com.unioff.services.BeneficioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/beneficios")
public class BeneficioController {

    @Autowired
    private BeneficioService beneficioService;

    @GetMapping
    public ResponseEntity<Page<BeneficioResponseDTO>> listarFeed(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) UUID empresaId,
            Pageable pageable) {
        Page<BeneficioResponseDTO> response = beneficioService.listarFeed(busca, empresaId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeneficioResponseDTO> buscarPorId(@PathVariable UUID id) {
        BeneficioResponseDTO response = beneficioService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<BeneficioResponseDTO> cadastrarBeneficio(
            java.security.Principal principal,
            @jakarta.validation.Valid @RequestBody com.unioff.dto.BeneficioRequestDTO dto) {
        BeneficioResponseDTO response = beneficioService.cadastrarBeneficio(principal.getName(), dto);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<BeneficioResponseDTO> atualizarBeneficio(
            @PathVariable UUID id,
            java.security.Principal principal,
            @RequestBody com.unioff.dto.BeneficioUpdateDTO dto) {
        BeneficioResponseDTO response = beneficioService.atualizarBeneficio(id, principal.getName(), dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('EMPRESA') or hasRole('ADMIN')")
    public ResponseEntity<Void> excluirBeneficio(
            @PathVariable UUID id,
            java.security.Principal principal) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        beneficioService.excluirBeneficio(id, principal.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }
}
