package com.unioff.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class BeneficioResumoDTO {
    private UUID id;
    private String titulo;
    private LocalDate dataFim;
}
