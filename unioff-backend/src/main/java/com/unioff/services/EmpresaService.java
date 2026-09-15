package com.unioff.services;

import com.unioff.dto.BeneficioResponseDTO;
import com.unioff.dto.EmpresaDetalhesDTO;
import com.unioff.dto.MetricasBeneficioDTO;
import com.unioff.dto.MetricasEmpresaDTO;
import com.unioff.entity.Beneficio;
import com.unioff.entity.StatusCupom;
import com.unioff.repository.BeneficioRepository;
import com.unioff.repository.CupomRepository;
import com.unioff.repository.UsuarioRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import com.unioff.dto.EmpresaResponseDTO;
import com.unioff.dto.EmpresaUpdateDTO;
import com.unioff.entity.Empresa;
import com.unioff.entity.Usuario;
import com.unioff.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BeneficioRepository beneficioRepository;

    public EmpresaResponseDTO getMinhaEmpresa(String email) {
        Empresa empresa = empresaRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        return mapToDTO(empresa);
    }

    @Transactional
    public EmpresaResponseDTO updateMinhaEmpresa(String email, EmpresaUpdateDTO dto) {
        Empresa empresa = empresaRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        Usuario usuario = empresa.getUsuario();

        if (dto.getNome() != null) {
            usuario.setNome(dto.getNome());
        }
        if (dto.getNomeFantasia() != null) {
            empresa.setNomeFantasia(dto.getNomeFantasia());
        }
        if (dto.getDescricao() != null) {
            empresa.setDescricao(dto.getDescricao());
        }
        if (dto.getCidade() != null) {
            empresa.setCidade(dto.getCidade());
        }
        if (dto.getBairro() != null) {
            empresa.setBairro(dto.getBairro());
        }
        if (dto.getLogradouro() != null) {
            empresa.setLogradouro(dto.getLogradouro());
        }
        if (dto.getNumero() != null) {
            empresa.setNumero(dto.getNumero());
        }
        if (dto.getTelephoneWhatsapp() != null) {
            empresa.setTelephoneWhatsapp(dto.getTelephoneWhatsapp());
        }
        if (dto.getSite() != null) {
            empresa.setSite(dto.getSite());
        }

        usuarioRepository.save(usuario);
        empresa = empresaRepository.save(empresa);

        return mapToDTO(empresa);
    }

    private EmpresaResponseDTO mapToDTO(Empresa empresa) {
        EmpresaResponseDTO dto = new EmpresaResponseDTO();
        dto.setId(empresa.getId());
        if (empresa.getUsuario() != null) {
            dto.setUsuarioId(empresa.getUsuario().getId());
            dto.setNome(empresa.getUsuario().getNome());
            dto.setEmail(empresa.getUsuario().getEmail());
        }
        dto.setNomeFantasia(empresa.getNomeFantasia());
        dto.setDescricao(empresa.getDescricao());
        dto.setCidade(empresa.getCidade());
        dto.setBairro(empresa.getBairro());
        dto.setLogradouro(empresa.getLogradouro());
        dto.setNumero(empresa.getNumero());
        dto.setTelephoneWhatsapp(empresa.getTelephoneWhatsapp());
        dto.setSite(empresa.getSite());
        return dto;
    }

    public Page<BeneficioResponseDTO> getBeneficiosDaEmpresa(
            String email, Boolean ativo, Boolean esgotado, Pageable pageable) {
        
        return beneficioRepository.findBeneficiosDaEmpresa(email, ativo, esgotado, pageable)
                .map(this::mapBeneficioToDTO);
    }

    private BeneficioResponseDTO mapBeneficioToDTO(Beneficio beneficio) {
        BeneficioResponseDTO dto = new BeneficioResponseDTO();
        dto.setId(beneficio.getId());
        dto.setTitulo(beneficio.getTitulo());
        dto.setDescricao(beneficio.getDescricao());
        dto.setDataInicio(beneficio.getDataInicio());
        dto.setDataFim(beneficio.getDataFim());
        dto.setQuantidadeResgates(beneficio.getQuantidadeResgates());
        dto.setQuantidadeMaxResgastes(beneficio.getQuantidadeMaxResgastes());
        dto.setAtivo(beneficio.isAtivo());
        
        int disponivel = beneficio.getQuantidadeMaxResgastes() - beneficio.getQuantidadeResgates();
        dto.setQuantidadeDisponivel(Math.max(0, disponivel));
        dto.setEsgotado(beneficio.getQuantidadeResgates() >= beneficio.getQuantidadeMaxResgastes());
        
        return dto;
    }

    public Page<EmpresaResponseDTO> listarEmpresas(
            String nome, String cidade, String bairro, Pageable pageable) {
        return empresaRepository.findByFiltros(nome, cidade, bairro, pageable)
                .map(this::mapToDTO);
    }

    public EmpresaDetalhesDTO getDetalhesEmpresa(UUID empresaId) {
        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        
        EmpresaDetalhesDTO dto = new EmpresaDetalhesDTO();
        dto.setId(empresa.getId());
        if (empresa.getUsuario() != null) {
            dto.setUsuarioId(empresa.getUsuario().getId());
            dto.setNome(empresa.getUsuario().getNome());
            dto.setEmail(empresa.getUsuario().getEmail());
        }
        dto.setNomeFantasia(empresa.getNomeFantasia());
        dto.setDescricao(empresa.getDescricao());
        dto.setCidade(empresa.getCidade());
        dto.setBairro(empresa.getBairro());
        dto.setLogradouro(empresa.getLogradouro());
        dto.setNumero(empresa.getNumero());
        dto.setTelephoneWhatsapp(empresa.getTelephoneWhatsapp());
        dto.setSite(empresa.getSite());
        
        if (empresa.getBeneficios() != null) {
            List<BeneficioResponseDTO> beneficiosDTO = empresa.getBeneficios().stream()
                    .map(this::mapBeneficioToDTO)
                    .collect(Collectors.toList());
            dto.setBeneficios(beneficiosDTO);
        }
        return dto;
    }

    @Autowired
    private CupomRepository cupomRepository;

    @Transactional(readOnly = true)
    public MetricasEmpresaDTO getMetricas(String email) {
        Empresa empresa = empresaRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        MetricasEmpresaDTO metricas = new MetricasEmpresaDTO();
        metricas.setEmpresaId(empresa.getId());
        metricas.setNomeFantasia(empresa.getNomeFantasia());

        List<Object[]> cuponsUsadosPorBeneficio = cupomRepository.countCuponsPorBeneficioStatus(empresa.getId(), StatusCupom.USADO);
        Map<UUID, Long> mapUsados = new HashMap<>();
        for (Object[] row : cuponsUsadosPorBeneficio) {
            mapUsados.put((UUID) row[0], ((Number) row[1]).longValue());
        }

        long totalBeneficios = 0;
        long totalBeneficiosAtivos = 0;
        long totalResgates = 0;
        long totalCuponsUtilizados = 0;

        List<MetricasBeneficioDTO> listaBeneficios = new ArrayList<>();

        if (empresa.getBeneficios() != null) {
            totalBeneficios = empresa.getBeneficios().size();
            for (Beneficio b : empresa.getBeneficios()) {
                if (b.isAtivo()) {
                    totalBeneficiosAtivos++;
                }
                totalResgates += b.getQuantidadeResgates();
                
                long usados = mapUsados.getOrDefault(b.getId(), 0L);
                totalCuponsUtilizados += usados;

                MetricasBeneficioDTO mb = new MetricasBeneficioDTO();
                mb.setBeneficioId(b.getId());
                mb.setTitulo(b.getTitulo());
                mb.setQuantidadeResgates(b.getQuantidadeResgates());
                mb.setQuantidadeMaxResgastes(b.getQuantidadeMaxResgastes());
                
                int disponivel = b.getQuantidadeMaxResgastes() - b.getQuantidadeResgates();
                mb.setQuantidadeDisponivel(Math.max(0, disponivel));
                mb.setEsgotado(b.getQuantidadeResgates() >= b.getQuantidadeMaxResgastes());
                mb.setQuantidadeCuponsUtilizados(usados);

                listaBeneficios.add(mb);
            }
        }

        metricas.setTotalBeneficios(totalBeneficios);
        metricas.setTotalBeneficiosAtivos(totalBeneficiosAtivos);
        metricas.setTotalResgates(totalResgates);
        metricas.setTotalCuponsUtilizados(totalCuponsUtilizados);
        metricas.setBeneficios(listaBeneficios);

        return metricas;
    }
}
