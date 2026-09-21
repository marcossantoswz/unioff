package com.unioff.services;

import com.unioff.dto.BeneficioRequestDTO;
import com.unioff.dto.BeneficioResponseDTO;
import com.unioff.dto.BeneficioUpdateDTO;
import com.unioff.entity.Beneficio;
import com.unioff.entity.Empresa;
import com.unioff.exceptions.BeneficioNotFoundException;
import com.unioff.exceptions.EmpresaNotFoundException;
import com.unioff.repository.BeneficioRepository;
import com.unioff.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class BeneficioService {

    @Autowired
    private BeneficioRepository beneficioRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    private BeneficioResponseDTO mapToDTO(Beneficio beneficio) {
        BeneficioResponseDTO dto = new BeneficioResponseDTO();
        dto.setId(beneficio.getId());
        dto.setTitulo(beneficio.getTitulo());
        dto.setDescricao(beneficio.getDescricao());
        dto.setDataInicio(beneficio.getDataInicio());
        dto.setDataFim(beneficio.getDataFim());
        dto.setQuantidadeResgates(beneficio.getQuantidadeResgates());
        dto.setQuantidadeMaxResgastes(beneficio.getQuantidadeMaxResgastes());
        dto.setQuantidadeDisponivel(beneficio.getQuantidadeMaxResgastes() - beneficio.getQuantidadeResgates());
        dto.setEsgotado(beneficio.getQuantidadeResgates() >= beneficio.getQuantidadeMaxResgastes());
        dto.setAtivo(beneficio.isAtivo());
        if (beneficio.getEmpresa() != null) {
            dto.setEmpresaId(beneficio.getEmpresa().getId());
            dto.setNomeEmpresa(beneficio.getEmpresa().getNomeFantasia());
        }
        return dto;
    }
}
