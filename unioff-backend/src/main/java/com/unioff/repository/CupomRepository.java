package com.unioff.repository;

import com.unioff.entity.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CupomRepository extends JpaRepository<Cupom, UUID> {
    List<Cupom> findByEstudanteIdOrderByDataGeracaoDesc(UUID estudanteId);
}
