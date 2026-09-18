package com.unioff.dto;

public record EmpresaCadastroRequestDTO(
        String nome,
        String email,
        String senha,
        String nomeFantasia,
        String cnpj,
        String descricao,
        String cidade,
        String bairro,
        String logradouro,
        String numero,
        String telephoneWhatsapp,
        String site
) {
}