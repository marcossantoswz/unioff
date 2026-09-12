package com.unioff.repository;

import com.unioff.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, UUID> {
    Optional<Empresa> findByUsuarioEmail(String email);

    @Query("SELECT e FROM Empresa e WHERE " +
           "(:nome IS NULL OR LOWER(e.nomeFantasia) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
           "(:cidade IS NULL OR LOWER(e.cidade) = LOWER(:cidade)) AND " +
           "(:bairro IS NULL OR LOWER(e.bairro) = LOWER(:bairro))")
    Page<Empresa> findByFiltros(
            @Param("nome") String nome,
            @Param("cidade") String cidade,
            @Param("bairro") String bairro,
            Pageable pageable);
}
