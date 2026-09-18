package com.unioff.controller;

import com.unioff.dto.*;
import com.unioff.entity.Empresa;
import com.unioff.entity.Estudante;
import com.unioff.services.AuthService;
import com.unioff.services.EmpresaService;
import com.unioff.services.EstudanteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final EstudanteService estudanteService;
    private final EmpresaService empresaService;
    private final AuthService authService;

    public AuthController(
            EstudanteService estudanteService,
            EmpresaService empresaService,
            AuthService authService
    ) {
        this.estudanteService = estudanteService;
        this.empresaService = empresaService;
        this.authService = authService;
    }

    @PostMapping("/estudantes")
    public ResponseEntity<EstudanteCadastroResponseDTO> cadastrarEstudante(
            @RequestBody EstudanteCadastroRequestDTO request
    ) {
        Estudante estudante = estudanteService.cadastrar(
                request.nome(),
                request.email(),
                request.senha(),
                request.instituicao(),
                request.curso(),
                request.matricula()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(estudante));
    }

    @PostMapping("/empresas")
    public ResponseEntity<EmpresaCadastroResponseDTO> cadastrarEmpresa( 
            @RequestBody EmpresaCadastroRequestDTO request
    ) {
        Empresa empresa = empresaService.cadastrar(
                request.nome(),
                request.email(),
                request.senha(),
                request.nomeFantasia(),
                request.cnpj(),
                request.descricao(),
                request.cidade(),
                request.bairro(),
                request.logradouro(),
                request.numero(),
                request.telephoneWhatsapp(),
                request.site()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(empresa));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO resposta = authService.login(request.email(), request.senha());
        return ResponseEntity.ok(resposta);
    }

    private EstudanteCadastroResponseDTO mapToDTO(Estudante estudante) {
        EstudanteCadastroResponseDTO dto = new EstudanteCadastroResponseDTO();
        dto.setId(estudante.getId());
        dto.setUsuarioId(estudante.getUsuario().getId());
        dto.setNome(estudante.getUsuario().getNome());
        dto.setEmail(estudante.getUsuario().getEmail());
        dto.setInstituicao(estudante.getInstituicao());
        dto.setCurso(estudante.getCurso());
        dto.setMatricula(estudante.getMatricula());
        dto.setTipoUsuario(estudante.getUsuario().getTipoUsuario().name());
        dto.setAtivo(estudante.getUsuario().isAtivo());
        dto.setDataCriacao(estudante.getUsuario().getDataCriacao());
        return dto;
    }

    private EmpresaCadastroResponseDTO mapToDTO(Empresa empresa) {
        EmpresaCadastroResponseDTO dto = new EmpresaCadastroResponseDTO();
        dto.setId(empresa.getId());
        dto.setUsuarioId(empresa.getUsuario().getId());
        dto.setNome(empresa.getUsuario().getNome());
        dto.setEmail(empresa.getUsuario().getEmail());
        dto.setNomeFantasia(empresa.getNomeFantasia());
        dto.setCnpj(empresa.getCnpj());
        dto.setDescricao(empresa.getDescricao());
        dto.setCidade(empresa.getCidade());
        dto.setBairro(empresa.getBairro());
        dto.setLogradouro(empresa.getLogradouro());
        dto.setNumero(empresa.getNumero());
        dto.setTelephoneWhatsapp(empresa.getTelephoneWhatsapp());
        dto.setSite(empresa.getSite());
        dto.setTipoUsuario(empresa.getUsuario().getTipoUsuario().name());
        dto.setAtivo(empresa.getUsuario().isAtivo());
        dto.setDataCriacao(empresa.getUsuario().getDataCriacao());
        return dto;
    }
}