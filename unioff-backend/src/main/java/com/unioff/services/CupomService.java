package com.unioff.services;

import com.unioff.entity.Cupom;
import com.unioff.repository.CupomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CupomService {

    private final CupomRepository cupomRepository;

    public CupomService(CupomRepository cupomRepository) {
        this.cupomRepository = cupomRepository;
    }

    /**
     * Lista o histórico de resgates do estudante, do mais recente para o mais antigo.
     * O estudanteId deve vir do usuário autenticado (extraído do JWT pelo Controller).
     */
    public List<Cupom> listarHistoricoDoEstudante(UUID estudanteId) {
        return cupomRepository.findByEstudanteIdOrderByDataGeracaoDesc(estudanteId);
    }
}