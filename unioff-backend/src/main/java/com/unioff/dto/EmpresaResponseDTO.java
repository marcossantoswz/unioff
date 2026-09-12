package com.unioff.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class EmpresaResponseDTO {
    private UUID id;
    private UUID usuarioId;
    private String nome;
    private String email;
    private String nomeFantasia;
    private String descricao;
    private String cidade;
    private String bairro;
    private String logradouro;
    private String numero;
    private String telephoneWhatsapp;
    private String site;
}
