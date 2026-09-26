package com.unioff.controller;

import com.unioff.dto.BeneficioResumoDTO;
import com.unioff.dto.CupomResponseDTO;
import com.unioff.dto.EmpresaResumoDTO;
import com.unioff.entity.Cupom;
import com.unioff.entity.StatusCupom;
import com.unioff.entity.Usuario;
import com.unioff.services.CupomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resgates")
public class CupomController {

    private final CupomService cupomService;

    public CupomController(CupomService cupomService) {
        this.cupomService = cupomService;
    }

    /**
     * O usuário autenticado (Usuario) tem o mesmo UUID do Estudante correspondente
     * (relacionamento @MapsId), então usuario.getId() já é o estudanteId certo —
     * não é preciso consultar EstudanteRepository para descobrir isso.
     * A rota já está restrita a ROLE_ESTUDANTE no SecurityConfig.
     */
    @GetMapping("/me")
    public ResponseEntity<List<CupomResponseDTO>> listarMeusResgates(
            @AuthenticationPrincipal Usuario usuario
    ) {
        List<Cupom> cupons = cupomService.listarHistoricoDoEstudante(usuario.getId());

        List<CupomResponseDTO> resposta = cupons.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(resposta);
    }

    private CupomResponseDTO mapToDTO(Cupom cupom) {
        CupomResponseDTO dto = new CupomResponseDTO();
        dto.setId(cupom.getId());
        dto.setCodigoCupom(cupom.getCodigo());
        dto.setDataResgate(cupom.getDataGeracao());
        dto.setUtilizado(cupom.getStatus() == StatusCupom.USADO);

        BeneficioResumoDTO beneficioDTO = new BeneficioResumoDTO();
        beneficioDTO.setId(cupom.getBeneficio().getId());
        beneficioDTO.setTitulo(cupom.getBeneficio().getTitulo());
        beneficioDTO.setDataFim(cupom.getBeneficio().getDataFim());
        dto.setBeneficio(beneficioDTO);

        EmpresaResumoDTO empresaDTO = new EmpresaResumoDTO();
        empresaDTO.setId(cupom.getBeneficio().getEmpresa().getId());
        empresaDTO.setNomeFantasia(cupom.getBeneficio().getEmpresa().getNomeFantasia());
        dto.setEmpresa(empresaDTO);

        return dto;
    }
}
