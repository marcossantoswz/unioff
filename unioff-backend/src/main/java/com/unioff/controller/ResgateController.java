package com.unioff.controller;

import com.unioff.dto.ResgateResponseDTO;
import com.unioff.entity.Cupom;
import com.unioff.entity.Usuario;
import com.unioff.services.CupomService;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/beneficios")
public class ResgateController {
    private final CupomService cupomService;

    public ResgateController(CupomService cupomService) {
        this.cupomService = cupomService;
    }

    @PostMapping("/{beneficioId}/resgates")
    public ResponseEntity<ResgateResponseDTO> resgatar(
            @PathVariable UUID beneficioId, @AuthenticationPrincipal Usuario usuario) {
        Cupom cupom = cupomService.resgatar(beneficioId, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ResgateResponseDTO(
                cupom.getId(), cupom.getCodigo(), cupom.getStatus(),
                cupom.getDataGeracao(), beneficioId));
    }
}
