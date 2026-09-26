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
           "(CAST(:nome AS string) IS NULL OR LOWER(e.nomeFantasia) LIKE LOWER(CONCAT('%', CAST(:nome AS string), '%'))) AND " +
           "(CAST(:cidade AS string) IS NULL OR LOWER(e.cidade) = LOWER(CAST(:cidade AS string))) AND " +
           "(CAST(:bairro AS string) IS NULL OR LOWER(e.bairro) = LOWER(CAST(:bairro AS string)))")
    Page<Empresa> findByFiltros(
            @Param("nome") String nome,
            @Param("cidade") String cidade,
            @Param("bairro") String bairro,
            Pageable pageable);
}
