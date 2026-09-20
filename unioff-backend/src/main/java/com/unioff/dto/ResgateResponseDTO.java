package com.unioff.dto;

import com.unioff.entity.StatusCupom;
import java.time.LocalDateTime;
import java.util.UUID;

public record ResgateResponseDTO(
        UUID id,
        String codigo,
        StatusCupom status,
        LocalDateTime dataGeracao,
        UUID beneficioId
) {}
