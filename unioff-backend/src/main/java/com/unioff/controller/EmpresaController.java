package com.unioff.controller;

import com.unioff.dto.BeneficioResponseDTO;
import com.unioff.dto.EmpresaDetalhesDTO;
import com.unioff.dto.MetricasEmpresaDTO;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import com.unioff.dto.EmpresaResponseDTO;
import com.unioff.dto.EmpresaUpdateDTO;
import com.unioff.services.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @GetMapping("/me")
    public ResponseEntity<EmpresaResponseDTO> getMinhaEmpresa(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        EmpresaResponseDTO response = empresaService.getMinhaEmpresa(principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<EmpresaResponseDTO> updateMinhaEmpresa(
            Principal principal,
            @RequestBody EmpresaUpdateDTO dto) {
        
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        EmpresaResponseDTO response = empresaService.updateMinhaEmpresa(principal.getName(), dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/beneficios")
    public ResponseEntity<Page<BeneficioResponseDTO>> getMeusBeneficios(
            Principal principal,
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) Boolean esgotado,
            Pageable pageable) {
        
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        Page<BeneficioResponseDTO> response = 
                empresaService.getBeneficiosDaEmpresa(principal.getName(), ativo, esgotado, pageable);
                
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<EmpresaResponseDTO>> listarEmpresas(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cidade,
            @RequestParam(required = false) String bairro,
            Pageable pageable) {
        
        Page<EmpresaResponseDTO> response = 
                empresaService.listarEmpresas(nome, cidade, bairro, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{empresaId}")
    public ResponseEntity<EmpresaDetalhesDTO> visualizarDetalhesEmpresa(
            @PathVariable UUID empresaId) {
        
        EmpresaDetalhesDTO response = empresaService.getDetalhesEmpresa(empresaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/metricas")
    public ResponseEntity<MetricasEmpresaDTO> getMinhasMetricas(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        MetricasEmpresaDTO response = empresaService.getMetricas(principal.getName());
        return ResponseEntity.ok(response);
    }
}
