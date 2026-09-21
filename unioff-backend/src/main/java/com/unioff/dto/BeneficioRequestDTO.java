package com.unioff.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BeneficioRequestDTO {

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @NotNull(message = "A data de início é obrigatória")
    @FutureOrPresent(message = "A data de início não pode estar no passado")
    private LocalDate dataInicio;

    @NotNull(message = "A data de fim é obrigatória")
    @FutureOrPresent(message = "A data de fim não pode estar no passado")
    private LocalDate dataFim;

    @NotNull(message = "A quantidade máxima de resgates é obrigatória")
    @Min(value = 1, message = "A quantidade de resgates deve ser pelo menos 1")
    private Integer quantidadeMaxResgastes;
}
