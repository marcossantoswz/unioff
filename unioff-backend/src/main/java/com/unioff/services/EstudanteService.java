package com.unioff.services;

import com.unioff.entity.Estudante;
import com.unioff.entity.TipoUsuario;
import com.unioff.entity.Usuario;
import com.unioff.exceptions.EmailJaCadastradoException;
import com.unioff.repository.EstudanteRepository;
import com.unioff.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EstudanteService {

    private final EstudanteRepository estudanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public EstudanteService(
            EstudanteRepository estudanteRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.estudanteRepository = estudanteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Estudante cadastrar(
            String nome,
            String email,
            String senha,
            String instituicao,
            String curso,
            String matricula
    ) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailJaCadastradoException(email);
        }

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(senha));
        usuario.setTipoUsuario(TipoUsuario.ESTUDANTE);
        usuario = usuarioRepository.save(usuario);

        Estudante estudante = new Estudante();
        estudante.setUsuario(usuario);
        estudante.setInstituicao(instituicao);
        estudante.setCurso(curso);
        estudante.setMatricula(matricula);

        return estudanteRepository.save(estudante);
    }
}