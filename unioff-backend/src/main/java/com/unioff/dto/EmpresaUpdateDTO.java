package com.unioff.dto;

import lombok.Data;

@Data
public class EmpresaUpdateDTO {
    private String nome;
    private String nomeFantasia;
    private String descricao;
    private String cidade;
    private String bairro;
    private String logradouro;
    private String numero;
    private String telephoneWhatsapp;
    private String site;
}
