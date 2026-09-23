package com.unioff.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CupomResponseDTO {
    private UUID id;
    private String codigoCupom;
    private LocalDateTime dataResgate;
    private boolean utilizado;
    private BeneficioResumoDTO beneficio;
    private EmpresaResumoDTO empresa;
}