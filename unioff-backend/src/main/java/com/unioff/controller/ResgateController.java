package com.unioff.controller;

import com.unioff.dto.CupomConsultaDTO;
import com.unioff.dto.ResgateResponseDTO;
import com.unioff.dto.ValidacaoCupomRequestDTO;
import com.unioff.entity.Cupom;
import com.unioff.entity.Usuario;
import com.unioff.services.CupomService;
import java.util.UUID;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ResgateController {
    private final CupomService cupomService;

    public ResgateController(CupomService cupomService) {
        this.cupomService = cupomService;
    }

    @PostMapping("/beneficios/{beneficioId}/resgates")
    public ResponseEntity<ResgateResponseDTO> resgatar(
            @PathVariable UUID beneficioId, @AuthenticationPrincipal Usuario usuario) {
        Cupom cupom = cupomService.resgatar(beneficioId, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ResgateResponseDTO(
                cupom.getId(), cupom.getCodigo(), cupom.getStatus(),
                cupom.getDataGeracao(), beneficioId));
    }

    @PostMapping("/resgates/validacoes")
    public ResponseEntity<ResgateResponseDTO> validar(
            @RequestBody ValidacaoCupomRequestDTO request,
            @AuthenticationPrincipal Usuario empresa) {
        Cupom cupom = cupomService.validar(request.codigo(), empresa);
        return ResponseEntity.ok(new ResgateResponseDTO(
                cupom.getId(), cupom.getCodigo(), cupom.getStatus(),
                cupom.getDataGeracao(), cupom.getBeneficio().getId()));
    }

    @GetMapping("/resgates/me")
    public List<CupomConsultaDTO> listarDoEstudante(
            @AuthenticationPrincipal Usuario estudante) {
        return cupomService.listarDoEstudante(estudante.getId());
    }

    @GetMapping("/resgates/empresa")
    public List<CupomConsultaDTO> listarDaEmpresa(
            @AuthenticationPrincipal Usuario empresa) {
        return cupomService.listarDaEmpresa(empresa.getEmail());
    }
}
