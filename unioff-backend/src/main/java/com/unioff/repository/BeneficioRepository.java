package com.unioff.repository;

import com.unioff.entity.Beneficio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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

    @Modifying
    @Query("UPDATE Beneficio b SET b.quantidadeResgates = b.quantidadeResgates + 1 " +
           "WHERE b.id = :beneficioId AND b.ativo = true " +
           "AND (b.dataInicio IS NULL OR b.dataInicio <= :hoje) " +
           "AND (b.dataFim IS NULL OR b.dataFim >= :hoje) " +
           "AND b.quantidadeResgates < b.quantidadeMaxResgastes")
    int incrementarResgatesSeDisponivel(
            @Param("beneficioId") UUID beneficioId,
            @Param("hoje") LocalDate hoje);
    @Query("SELECT b FROM Beneficio b WHERE b.ativo = true " +
           "AND b.quantidadeResgates < b.quantidadeMaxResgastes " +
           "AND (b.dataInicio IS NULL OR b.dataInicio <= CURRENT_DATE) " +
           "AND (b.dataFim IS NULL OR b.dataFim >= CURRENT_DATE) " +
           "AND (:busca IS NULL OR LOWER(b.titulo) LIKE LOWER(CONCAT('%', :busca, '%')) OR LOWER(b.descricao) LIKE LOWER(CONCAT('%', :busca, '%'))) " +
           "AND (:empresaId IS NULL OR b.empresa.id = :empresaId)")
    Page<Beneficio> findBeneficiosFeed(
            @Param("busca") String busca,
            @Param("empresaId") UUID empresaId,
            Pageable pageable);
}
