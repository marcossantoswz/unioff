package com.unioff.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UsuarioResumoDTO {
    private UUID id;
    private String nome;
    private String email;
    private String tipoUsuario;
}