package com.unioff.services;

import com.unioff.security.JwtService;
import com.unioff.dto.LoginResponseDTO;
import com.unioff.dto.UsuarioResumoDTO;
import com.unioff.entity.Usuario;
import com.unioff.exceptions.CredenciaisInvalidasException;
import com.unioff.exceptions.UsuarioInativoException;
import com.unioff.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * Fluxo completo de login: valida credenciais, gera o token e monta
     * a resposta já no formato esperado pelo Controller (especificação 3.3).
     */
    public LoginResponseDTO login(String email, String senha) {
        Usuario usuario = autenticar(email, senha);
        String token = jwtService.gerarToken(usuario);

        UsuarioResumoDTO usuarioResumo = new UsuarioResumoDTO();
        usuarioResumo.setId(usuario.getId());
        usuarioResumo.setNome(usuario.getNome());
        usuarioResumo.setEmail(usuario.getEmail());
        usuarioResumo.setTipoUsuario(usuario.getTipoUsuario().name());

        LoginResponseDTO resposta = new LoginResponseDTO();
        resposta.setAccessToken(token);
        resposta.setExpiresIn(jwtService.getExpiracaoSegundos());
        resposta.setUsuario(usuarioResumo);

        return resposta;
    }

    /**
     * Verifica e-mail e senha e retorna o Usuario autenticado.
     * Conforme especificação: e-mail não encontrado ou senha incorreta
     * lançam CredenciaisInvalidasException (401). Conta desativada lança
     * UsuarioInativoException (403).
     */
    public Usuario autenticar(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(CredenciaisInvalidasException::new);

        if (!passwordEncoder.matches(senha, usuario.getSenhaHash())) {
            throw new CredenciaisInvalidasException();
        }

        if (!usuario.isEnabled()) {
            throw new UsuarioInativoException();
        }

        return usuario;
    }
}