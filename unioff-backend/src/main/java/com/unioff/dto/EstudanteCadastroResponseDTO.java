package com.unioff.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class EstudanteCadastroResponseDTO {
    private UUID id;
    private UUID usuarioId;
    private String nome;
    private String email;
    private String instituicao;
    private String curso;
    private String matricula;
    private String tipoUsuario;
    private boolean ativo;
    private LocalDateTime dataCriacao;
}
