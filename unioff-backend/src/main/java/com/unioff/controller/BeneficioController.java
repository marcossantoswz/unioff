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
}
