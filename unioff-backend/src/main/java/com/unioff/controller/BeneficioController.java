package com.unioff.controller;

import com.unioff.dto.BeneficioResponseDTO;
import com.unioff.services.BeneficioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;

@RestController
@RequestMapping("/api/beneficios")
@Tag(name = "Benefícios", description = "Gerenciamento e feed de benefícios estudantis")
public class BeneficioController {

    @Autowired
    private BeneficioService beneficioService;

    @GetMapping
    @Operation(summary = "Feed de Benefícios", description = "Lista benefícios disponíveis com filtros opcionais")
    public ResponseEntity<Page<BeneficioResponseDTO>> listarFeed(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) UUID empresaId,
            Pageable pageable) {
        Page<BeneficioResponseDTO> response = beneficioService.listarFeed(busca, empresaId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalhes do Benefício", description = "Retorna todos os detalhes de uma oferta específica")
    public ResponseEntity<BeneficioResponseDTO> buscarPorId(@PathVariable UUID id) {
        BeneficioResponseDTO response = beneficioService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('EMPRESA')")
    @Operation(summary = "Cadastrar Benefício", description = "Cria um novo benefício vinculado à empresa autenticada")
    public ResponseEntity<BeneficioResponseDTO> cadastrarBeneficio(
            java.security.Principal principal,
            @jakarta.validation.Valid @RequestBody com.unioff.dto.BeneficioRequestDTO dto) {
        BeneficioResponseDTO response = beneficioService.cadastrarBeneficio(principal.getName(), dto);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('EMPRESA')")
    @Operation(summary = "Atualizar Benefício", description = "Atualiza os dados de um benefício pertencente à empresa logada")
    public ResponseEntity<BeneficioResponseDTO> atualizarBeneficio(
            @PathVariable UUID id,
            java.security.Principal principal,
            @RequestBody com.unioff.dto.BeneficioUpdateDTO dto) {
        BeneficioResponseDTO response = beneficioService.atualizarBeneficio(id, principal.getName(), dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('EMPRESA') or hasRole('ADMIN')")
    @Operation(summary = "Desativar Benefício", description = "Desativa um benefício (exclusão lógica). Requer permissão de dono ou admin.")
    public ResponseEntity<Void> excluirBeneficio(
            @PathVariable UUID id,
            java.security.Principal principal) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        beneficioService.excluirBeneficio(id, principal.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }
}
