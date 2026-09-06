package com.unioff.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "estudantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Estudante {

    @Id
    private UUID id;

    @Column(name = "nome_estudante", nullable = false)
    private String nomeEstudante;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private String instituicao;

    private String endereco;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private Usuario usuario;
}
