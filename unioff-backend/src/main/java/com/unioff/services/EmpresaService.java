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
}
