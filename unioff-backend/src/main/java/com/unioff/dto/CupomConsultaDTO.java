package com.unioff.dto;

import com.unioff.entity.Cupom;
import com.unioff.entity.StatusCupom;
import java.time.LocalDateTime;
import java.util.UUID;

public record CupomConsultaDTO(
        UUID id,
        String codigo,
        StatusCupom status,
        LocalDateTime dataGeracao,
        LocalDateTime dataUso,
        UUID beneficioId,
        String beneficioTitulo,
        UUID estudanteId,
        String estudanteNome,
        String empresaNome
) {
    public static CupomConsultaDTO de(Cupom cupom) {
        return new CupomConsultaDTO(
                cupom.getId(), cupom.getCodigo(), cupom.getStatus(),
                cupom.getDataGeracao(), cupom.getDataUso(),
                cupom.getBeneficio().getId(), cupom.getBeneficio().getTitulo(),
                cupom.getEstudante().getId(), cupom.getEstudante().getUsuario().getNome(),
                cupom.getBeneficio().getEmpresa().getNomeFantasia());
    }
}
