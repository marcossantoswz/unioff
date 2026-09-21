package com.unioff.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class BeneficioResponseDTO {
    private UUID id;
    private String titulo;
    private String descricao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Integer quantidadeResgates;
    private Integer quantidadeMaxResgastes;
    private Integer quantidadeDisponivel;
    private Boolean esgotado;
    private Boolean ativo;
    private UUID empresaId;
    private String nomeEmpresa;
}
