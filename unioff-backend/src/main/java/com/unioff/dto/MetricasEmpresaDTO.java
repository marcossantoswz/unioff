package com.unioff.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class MetricasEmpresaDTO {
    private UUID empresaId;
    private String nomeFantasia;
    private Long totalBeneficios;
    private Long totalBeneficiosAtivos;
    private Long totalResgates;
    private Long totalCuponsUtilizados;
    private List<MetricasBeneficioDTO> beneficios;
}
