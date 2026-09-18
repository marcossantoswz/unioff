package com.unioff.dto;

public record EstudanteCadastroRequestDTO(
        String nome,
        String email,
        String senha,
        String instituicao,
        String curso,
        String matricula
) {
}
