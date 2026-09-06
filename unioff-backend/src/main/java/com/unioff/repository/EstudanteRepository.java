package com.unioff.repository;

import com.unioff.entity.Estudante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EstudanteRepository extends JpaRepository<Estudante, UUID> {
    boolean existsByMatricula(String matricula);
}
