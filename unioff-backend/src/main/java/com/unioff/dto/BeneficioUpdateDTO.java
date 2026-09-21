package com.unioff.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BeneficioUpdateDTO {
    
    // Todos os campos são opcionais para permitir atualizações parciais
    private String titulo;
    private String descricao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Integer quantidadeMaxResgastes;
    private Boolean ativo;
}
