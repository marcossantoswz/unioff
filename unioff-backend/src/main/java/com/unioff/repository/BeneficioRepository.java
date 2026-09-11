package com.unioff.repository;

import com.unioff.entity.Beneficio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BeneficioRepository extends JpaRepository<Beneficio, UUID> {

    @Query("SELECT b FROM Beneficio b WHERE b.empresa.usuario.email = :email " +
           "AND (:ativo IS NULL OR b.ativo = :ativo) " +
           "AND (:esgotado IS NULL OR " +
           "  (:esgotado = true AND b.quantidadeResgates >= b.quantidadeMaxResgastes) OR " +
           "  (:esgotado = false AND b.quantidadeResgates < b.quantidadeMaxResgastes)" +
           ")")
    Page<Beneficio> findBeneficiosDaEmpresa(
            @Param("email") String email,
            @Param("ativo") Boolean ativo,
            @Param("esgotado") Boolean esgotado,
            Pageable pageable);
}
