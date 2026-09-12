package com.unioff.services;

import com.unioff.dto.EmpresaResponseDTO;
import com.unioff.dto.EmpresaUpdateDTO;
import com.unioff.entity.Empresa;
import com.unioff.entity.Usuario;
import com.unioff.repository.EmpresaRepository;
import com.unioff.repository.UsuarioRepository;
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
    private com.unioff.repository.BeneficioRepository beneficioRepository;

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

    public org.springframework.data.domain.Page<com.unioff.dto.BeneficioResponseDTO> getBeneficiosDaEmpresa(
            String email, Boolean ativo, Boolean esgotado, org.springframework.data.domain.Pageable pageable) {
        
        return beneficioRepository.findBeneficiosDaEmpresa(email, ativo, esgotado, pageable)
                .map(this::mapBeneficioToDTO);
    }

    private com.unioff.dto.BeneficioResponseDTO mapBeneficioToDTO(com.unioff.entity.Beneficio beneficio) {
        com.unioff.dto.BeneficioResponseDTO dto = new com.unioff.dto.BeneficioResponseDTO();
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

    public org.springframework.data.domain.Page<EmpresaResponseDTO> listarEmpresas(
            String nome, String cidade, String bairro, org.springframework.data.domain.Pageable pageable) {
        return empresaRepository.findByFiltros(nome, cidade, bairro, pageable)
                .map(this::mapToDTO);
    }

    public com.unioff.dto.EmpresaDetalhesDTO getDetalhesEmpresa(java.util.UUID empresaId) {
        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        
        com.unioff.dto.EmpresaDetalhesDTO dto = new com.unioff.dto.EmpresaDetalhesDTO();
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
            java.util.List<com.unioff.dto.BeneficioResponseDTO> beneficiosDTO = empresa.getBeneficios().stream()
                    .map(this::mapBeneficioToDTO)
                    .collect(java.util.stream.Collectors.toList());
            dto.setBeneficios(beneficiosDTO);
        }
        return dto;
    }
}
