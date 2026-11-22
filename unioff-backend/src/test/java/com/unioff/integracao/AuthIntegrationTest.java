package com.unioff.integracao;

import com.unioff.repository.EmpresaRepository;
import com.unioff.repository.EstudanteRepository;
import com.unioff.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EstudanteRepository estudanteRepository;
    @Autowired private EmpresaRepository empresaRepository;

    @Test
    void cadastraEstudanteERealizaLogin() throws Exception {
        String email = "novo-estudante@teste.com";
        String payload = """
                {
                  "nome": "Estudante Novo",
                  "email": "novo-estudante@teste.com",
                  "senha": "senha123",
                  "instituicao": "Universidade Federal de Minas Gerais",
                  "curso": "Ciência da Computação",
                  "matricula": "2026001"
                }
                """;

        mockMvc.perform(post("/api/auth/estudantes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Estudante Novo"))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.tipoUsuario").value("ESTUDANTE"));

        assertTrue(usuarioRepository.existsByEmail(email)); // Verifica se o usuário foi criado no banco de dados
        assertTrue(estudanteRepository.findAll().stream()
                .anyMatch(estudante -> estudante.getUsuario().getEmail().equals(email))); // Verifica se o estudante foi criado no banco de dados

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"novo-estudante@teste.com","senha":"senha123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.usuario.email").value(email))
                .andExpect(jsonPath("$.usuario.tipoUsuario").value("ESTUDANTE"));
    }

    @Test
    void cadastraEmpresaERealizaLogin() throws Exception {
        String email = "nova-empresa@teste.com";
        String payload = """
                {
                  "nome": "Responsavel Empresa",
                  "email": "nova-empresa@teste.com",
                  "senha": "senha123",
                  "nomeFantasia": "Empresa Nova",
                  "cnpj": "99888777000166",
                  "descricao": "Beneficios para estudantes",
                  "cidade": "Belo Horizonte",
                  "bairro": "Centro",
                  "logradouro": "Rua Principal",
                  "numero": "100",
                  "telephoneWhatsapp": "31999999999",
                  "site": "https://empresa.test"
                }
                """;

        mockMvc.perform(post("/api/auth/empresas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nomeFantasia").value("Empresa Nova"))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.tipoUsuario").value("EMPRESA"));

        assertTrue(usuarioRepository.existsByEmail(email));
        assertTrue(empresaRepository.findAll().stream()
                .anyMatch(empresa -> empresa.getUsuario().getEmail().equals(email)));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"nova-empresa@teste.com","senha":"senha123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.usuario.tipoUsuario").value("EMPRESA"));
    }

    @Test
    void loginComCredenciaisIncorretasRetornaNaoAutorizado() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"inexistente@teste.com","senha":"errada"}
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void cadastroComEmailExistenteRetornaConflito() throws Exception {
        String payload = """
                {
                  "nome": "Estudante Existente",
                  "email": "estudante@teste.com",
                  "senha": "senha123",
                  "instituicao": "UFMG",
                  "curso": "Direito",
                  "matricula": "2026002"
                }
                """;

        mockMvc.perform(post("/api/auth/estudantes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isConflict());
    }
}
