package com.unioff.integracao;

import com.unioff.entity.Empresa;
import com.unioff.repository.EmpresaRepository;
import com.unioff.services.EmpresaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class EmpresaIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Test
    void cadastrarListarEVisualizarDetalhesIntegrado() throws Exception {
        Empresa salva = empresaService.cadastrar(
                "Cafe Integracao", "integracao@teste.com", "senha123",
                "Cafe Integracao Ltda", "99888777000166", "Cafe artesanal",
                "Curitiba", "Batel", "Av Batel", "500", "41999999999", "https://cafe.test"
        );

        mockMvc.perform(get("/api/empresas")
                        .param("nome", "Integracao")
                        .param("cidade", "Curitiba"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].nomeFantasia").value("Cafe Integracao Ltda"))
                .andExpect(jsonPath("$.content[0].bairro").value("Batel"));

        mockMvc.perform(get("/api/empresas/{id}", salva.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(salva.getId().toString()))
                .andExpect(jsonPath("$.email").value("integracao@teste.com"));
    }

    @Test
    @WithMockUser(username = "empresa@teste.com", roles = "EMPRESA")
    void consultarEAtualizarMinhaEmpresaIntegrado() throws Exception {
        mockMvc.perform(get("/api/empresas/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeFantasia").value("Pizzaria Universitária"));

        String payload = """
                {
                  "nomeFantasia": "Pizzaria Atualizada",
                  "cidade": "Belo Horizonte",
                  "bairro": "Savassi"
                }
                """;

        mockMvc.perform(put("/api/empresas/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeFantasia").value("Pizzaria Atualizada"))
                .andExpect(jsonPath("$.cidade").value("Belo Horizonte"));

        Empresa atualizada = empresaRepository.findByUsuarioEmail("empresa@teste.com").orElseThrow();
        assertEquals("Pizzaria Atualizada", atualizada.getNomeFantasia());
        assertEquals("Savassi", atualizada.getBairro());
    }

    @Test
    @WithMockUser(username = "empresa@teste.com", roles = "EMPRESA")
    void consultarBeneficiosEMetricasDaEmpresaIntegrado() throws Exception {
        mockMvc.perform(get("/api/empresas/me/beneficios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].titulo").value("20% de desconto em pizzas"));

        mockMvc.perform(get("/api/empresas/me/metricas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeFantasia").value("Pizzaria Universitária"))
                .andExpect(jsonPath("$.totalBeneficios").value(1))
                .andExpect(jsonPath("$.totalCuponsUtilizados").value(1));
    }
}
