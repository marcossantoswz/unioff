package com.unioff.repository;

import com.unioff.entity.Cupom;
import com.unioff.entity.StatusCupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface CupomRepository extends JpaRepository<Cupom, UUID> {

    @Query("SELECT c.beneficio.id, COUNT(c) FROM Cupom c WHERE c.beneficio.empresa.id = :empresaId AND c.status = :status GROUP BY c.beneficio.id")
    List<Object[]> countCuponsPorBeneficioStatus(
            @Param("empresaId") UUID empresaId, 
            @Param("status") StatusCupom status);
}
