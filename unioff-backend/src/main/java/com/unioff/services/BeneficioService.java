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

    public BeneficioResponseDTO cadastrarBeneficio(String emailEmpresa, BeneficioRequestDTO dto) {
        if (dto.getDataFim() != null && dto.getDataFim().isBefore(dto.getDataInicio())) {
            throw new IllegalArgumentException("A data de fim não pode ser anterior à data de início");
        }

        Empresa empresa = empresaRepository.findByUsuarioEmail(emailEmpresa)
                .orElseThrow(() -> new EmpresaNotFoundException("Empresa não encontrada"));

        Beneficio beneficio = new Beneficio();
        beneficio.setTitulo(dto.getTitulo());
        beneficio.setDescricao(dto.getDescricao());
        beneficio.setDataInicio(dto.getDataInicio());
        beneficio.setDataFim(dto.getDataFim());
        beneficio.setQuantidadeMaxResgastes(dto.getQuantidadeMaxResgastes());
        beneficio.setQuantidadeResgates(0);
        beneficio.setAtivo(true);
        beneficio.setEmpresa(empresa);

        beneficio = beneficioRepository.save(beneficio);
        return mapToDTO(beneficio);
    }

    public BeneficioResponseDTO atualizarBeneficio(UUID id, String emailEmpresa, BeneficioUpdateDTO dto) {
        Beneficio beneficio = beneficioRepository.findById(id)
                .orElseThrow(() -> new BeneficioNotFoundException("Benefício não encontrado com id: " + id));

        if (!beneficio.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new SecurityException("Permissão negada. Você só pode editar os benefícios da sua empresa.");
        }

        if (dto.getTitulo() != null) beneficio.setTitulo(dto.getTitulo());
        if (dto.getDescricao() != null) beneficio.setDescricao(dto.getDescricao());
        if (dto.getDataInicio() != null) beneficio.setDataInicio(dto.getDataInicio());
        if (dto.getDataFim() != null) beneficio.setDataFim(dto.getDataFim());
        if (dto.getQuantidadeMaxResgastes() != null) beneficio.setQuantidadeMaxResgastes(dto.getQuantidadeMaxResgastes());
        if (dto.getAtivo() != null) beneficio.setAtivo(dto.getAtivo());

        if (beneficio.getDataFim() != null && beneficio.getDataFim().isBefore(beneficio.getDataInicio())) {
            throw new IllegalArgumentException("A data de fim não pode ser anterior à data de início");
        }

        beneficio = beneficioRepository.save(beneficio);
        return mapToDTO(beneficio);
    }

    public void excluirBeneficio(UUID id, String emailLogado, boolean isAdmin) {
        Beneficio beneficio = beneficioRepository.findById(id)
                .orElseThrow(() -> new BeneficioNotFoundException("Benefício não encontrado com id: " + id));

        if (!isAdmin && !beneficio.getEmpresa().getUsuario().getEmail().equals(emailLogado)) {
            throw new SecurityException("Permissão negada para desativar este benefício.");
        }

        // Realizamos uma exclusão lógica (soft-delete) para preservar histórico de resgates
        beneficio.setAtivo(false);
        beneficioRepository.save(beneficio);
    }

    public BeneficioResponseDTO buscarPorId(UUID id) {
        Beneficio beneficio = beneficioRepository.findById(id)
                .orElseThrow(() -> new BeneficioNotFoundException("Benefício não encontrado com id: " + id));
        return mapToDTO(beneficio);
    }

    public Page<BeneficioResponseDTO> listarFeed(String busca, UUID empresaId, Pageable pageable) {
        Page<Beneficio> beneficios = beneficioRepository.findBeneficiosFeed(busca, empresaId, pageable);
        return beneficios.map(this::mapToDTO);
    }

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
