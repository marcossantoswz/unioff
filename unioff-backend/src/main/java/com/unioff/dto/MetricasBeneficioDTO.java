package com.unioff.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class MetricasBeneficioDTO {
    private UUID beneficioId;
    private String titulo;
    private Integer quantidadeResgates;
    private Integer quantidadeMaxResgastes;
    private Integer quantidadeDisponivel;
    private Boolean esgotado;
    private Long quantidadeCuponsUtilizados;
}
