package com.unioff.services;

import com.unioff.entity.Cupom;
import com.unioff.entity.Beneficio;
import com.unioff.entity.Estudante;
import com.unioff.entity.Usuario;
import com.unioff.exceptions.BeneficioIndisponivelException;
import com.unioff.exceptions.CupomInvalidoException;
import com.unioff.exceptions.ResgateDuplicadoException;
import com.unioff.exceptions.ResourceNotFoundException;
import com.unioff.repository.BeneficioRepository;
import com.unioff.repository.CupomRepository;
import com.unioff.repository.EstudanteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CupomService {

    private final CupomRepository cupomRepository;
    private final BeneficioRepository beneficioRepository;
    private final EstudanteRepository estudanteRepository;

    public CupomService(CupomRepository cupomRepository,
                        BeneficioRepository beneficioRepository,
                        EstudanteRepository estudanteRepository) {
        this.cupomRepository = cupomRepository;
        this.beneficioRepository = beneficioRepository;
        this.estudanteRepository = estudanteRepository;
    }

    @Transactional
    public Cupom resgatar(UUID beneficioId, Usuario usuario) {
        UUID estudanteId = usuario.getId();
        Estudante estudante = estudanteRepository.findById(estudanteId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudante não encontrado"));
        Beneficio beneficio = beneficioRepository.findById(beneficioId)
                .orElseThrow(() -> new ResourceNotFoundException("Benefício não encontrado"));

        if (cupomRepository.existsByEstudanteIdAndBeneficioId(estudanteId, beneficioId)) {
            throw new ResgateDuplicadoException();
        }
        if (beneficioRepository.incrementarResgatesSeDisponivel(beneficioId, LocalDate.now()) != 1) {
            throw new BeneficioIndisponivelException();
        }

        Cupom cupom = new Cupom();
        cupom.setCodigo("UNI-" + UUID.randomUUID().toString().replace("-", ""));
        cupom.setDataGeracao(LocalDateTime.now());
        cupom.setEstudante(estudante);
        cupom.setBeneficio(beneficio);
        try {
            return cupomRepository.saveAndFlush(cupom);
        } catch (DataIntegrityViolationException ex) {
            throw new ResgateDuplicadoException();
        }
    }

    @Transactional
    public Cupom validar(String codigo, Usuario empresa) {
        int atualizados = cupomRepository.validarPendenteDaEmpresa(
                codigo, empresa.getEmail(), LocalDateTime.now());
        if (atualizados != 1) {
            throw new CupomInvalidoException();
        }
        return cupomRepository.findByCodigo(codigo).orElseThrow();
    }

    /**
     * Lista o histórico de resgates do estudante, do mais recente para o mais antigo.
     * O estudanteId deve vir do usuário autenticado (extraído do JWT pelo Controller).
     */
    public List<Cupom> listarHistoricoDoEstudante(UUID estudanteId) {
        return cupomRepository.findByEstudanteIdOrderByDataGeracaoDesc(estudanteId);
    }
}
