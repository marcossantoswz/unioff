package com.unioff.integracao;

import com.unioff.entity.Beneficio;
import com.unioff.repository.BeneficioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BeneficioIntegrationTest {

    private static final String EMPRESA = "empresa@teste.com";

    @Autowired private MockMvc mockMvc;
    @Autowired private BeneficioRepository beneficioRepository;

    private String payloadNovo(String titulo) {
        return """
                {"titulo": "%s", "descricao": "Valido para estudantes com carteirinha",
                 "dataInicio": "%s", "dataFim": "%s", "quantidadeMaxResgastes": 15}
                """.formatted(titulo, LocalDate.now(), LocalDate.now().plusDays(30));
    }

    private UUID criarViaApi(String titulo) throws Exception {
        String corpo = mockMvc.perform(post("/api/beneficios")
                        .contentType(MediaType.APPLICATION_JSON).content(payloadNovo(titulo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value(titulo))
                .andExpect(jsonPath("$.ativo").value(true))
                .andExpect(jsonPath("$.quantidadeDisponivel").value(15))
                .andReturn().getResponse().getContentAsString();
        return UUID.fromString(corpo.replaceAll(".*\"id\":\"([^\"]+)\".*", "$1"));
    }

    @Test
    @WithMockUser(username = EMPRESA, roles = "EMPRESA")
    void empresaCadastraConsultaAtualizaEDesativaBeneficio() throws Exception {
        UUID id = criarViaApi("Cafe gratis na compra do almoco");

        Beneficio salvo = beneficioRepository.findById(id).orElseThrow();
        assertEquals(EMPRESA, salvo.getEmpresa().getUsuario().getEmail());
        assertEquals(0, salvo.getQuantidadeResgates());

        mockMvc.perform(get("/api/beneficios/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeEmpresa").value("Pizzaria Universitária"));

        mockMvc.perform(put("/api/beneficios/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\": \"Cafe gratis\", \"quantidadeMaxResgastes\": 40}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Cafe gratis"))
                .andExpect(jsonPath("$.descricao").value("Valido para estudantes com carteirinha"))
                .andExpect(jsonPath("$.quantidadeDisponivel").value(40));

        mockMvc.perform(delete("/api/beneficios/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/beneficios/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));
        assertFalse(beneficioRepository.findById(id).orElseThrow().isAtivo());
    }

    @Test
    @WithMockUser(username = EMPRESA, roles = "EMPRESA")
    void cadastroInvalidoRetorna400ComMensagemDoDto() throws Exception {
        String invalido = payloadNovo("").replace("\"quantidadeMaxResgastes\": 15", "\"quantidadeMaxResgastes\": 0");

        mockMvc.perform(post("/api/beneficios")
                        .contentType(MediaType.APPLICATION_JSON).content(invalido))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.path").value("/api/beneficios"));
        assertEquals(0, beneficioRepository.findAll().stream().filter(b -> b.getTitulo().isBlank()).count());
    }

    @Test
    void beneficioInexistenteRetorna404ESemLoginRetorna401() throws Exception {
        mockMvc.perform(get("/api/beneficios/{id}", UUID.randomUUID()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.startsWith("Benefício não encontrado")));

        mockMvc.perform(post("/api/beneficios")
                        .contentType(MediaType.APPLICATION_JSON).content(payloadNovo("Sem login")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = EMPRESA, roles = "EMPRESA")
    void feedPublicoEncontraPorBuscaEEscondeDesativados() throws Exception {
        UUID id = criarViaApi("Sobremesa surpresa da integracao");

        mockMvc.perform(get("/api/beneficios").param("busca", "SURPRESA DA INTEGRACAO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].id").value(id.toString()));

        mockMvc.perform(delete("/api/beneficios/{id}", id)).andExpect(status().isNoContent());

        mockMvc.perform(get("/api/beneficios").param("busca", "surpresa da integracao"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(0));
    }
}
