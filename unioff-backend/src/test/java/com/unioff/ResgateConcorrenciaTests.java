package com.unioff;

import com.unioff.entity.Beneficio;
import com.unioff.entity.Empresa;
import com.unioff.entity.Usuario;
import com.unioff.exceptions.BeneficioIndisponivelException;
import com.unioff.repository.BeneficioRepository;
import com.unioff.repository.CupomRepository;
import com.unioff.repository.EmpresaRepository;
import com.unioff.repository.UsuarioRepository;
import com.unioff.services.CupomService;
import com.unioff.services.EstudanteService;
import java.time.LocalDate;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
class ResgateConcorrenciaTests {
    @Autowired MockMvc mvc;
    @Autowired CupomService resgates;
    @Autowired EstudanteService estudantes;
    @Autowired BeneficioRepository beneficios;
    @Autowired CupomRepository cupons;
    @Autowired EmpresaRepository empresas;
    @Autowired UsuarioRepository usuarios;
    @Test
    void exigeAutenticacao() throws Exception {
        assertEquals(401, mvc.perform(post("/api/beneficios/{id}/resgates", UUID.randomUUID()))
                .andReturn().getResponse().getStatus());
    }

    @Test
    @WithMockUser(roles = "EMPRESA")
    void empresaNaoAcessaConsultaDoEstudante() throws Exception {
        assertEquals(403, mvc.perform(org.springframework.test.web.servlet.request
                .MockMvcRequestBuilders.get("/api/resgates/me"))
                .andReturn().getResponse().getStatus());
    }

    @Test
    @WithMockUser(roles = "ESTUDANTE")
    void estudanteNaoAcessaConsultaDaEmpresa() throws Exception {
        assertEquals(403, mvc.perform(org.springframework.test.web.servlet.request
                .MockMvcRequestBuilders.get("/api/resgates/empresa"))
                .andReturn().getResponse().getStatus());
    }

    @Test
    void duasSolicitacoesNaoUltrapassamUmaVaga() throws Exception {
        Usuario primeiro = usuarios.findByEmail("estudante@teste.com").orElseThrow();
        Usuario dono = usuarios.findByEmail("empresa@teste.com").orElseThrow();
        Empresa empresa = empresas.findById(dono.getId()).orElseThrow();
        var segundo = estudantes.cadastrar("Outro estudante",
                "concorrencia-" + UUID.randomUUID() + "@teste.com",
                "senha123", "Universidade", null, null).getUsuario();

        Beneficio beneficio = new Beneficio();
        beneficio.setEmpresa(empresa);
        beneficio.setTitulo("Última vaga");
        beneficio.setDescricao("Teste de concorrência");
        beneficio.setDataInicio(LocalDate.now());
        beneficio.setDataFim(LocalDate.now().plusDays(1));
        beneficio.setQuantidadeMaxResgastes(1);
        UUID beneficioId = beneficios.saveAndFlush(beneficio).getId();

        var pool = Executors.newFixedThreadPool(2);
        var pronto = new CountDownLatch(2);
        var inicio = new CountDownLatch(1);
        try {
            Callable<Boolean> primeiraChamada = tentativa(beneficioId, primeiro, pronto, inicio);
            Callable<Boolean> segundaChamada = tentativa(beneficioId, segundo, pronto, inicio);
            var resultado1 = pool.submit(primeiraChamada);
            var resultado2 = pool.submit(segundaChamada);
            assertTrue(pronto.await(5, TimeUnit.SECONDS));
            inicio.countDown();
            int sucessos = (resultado1.get(10, TimeUnit.SECONDS) ? 1 : 0)
                    + (resultado2.get(10, TimeUnit.SECONDS) ? 1 : 0);
            assertEquals(1, sucessos);
        } finally {
            inicio.countDown();
            pool.shutdownNow();
        }

        assertEquals(1, beneficios.findById(beneficioId).orElseThrow().getQuantidadeResgates());
        assertEquals(1, cupons.findAll().stream()
                .filter(c -> c.getBeneficio().getId().equals(beneficioId)).count());
    }

    private Callable<Boolean> tentativa(UUID beneficioId, Usuario usuario,
            CountDownLatch pronto, CountDownLatch inicio) {
        return () -> {
            pronto.countDown();
            if (!inicio.await(5, TimeUnit.SECONDS)) {
                throw new AssertionError("As chamadas não começaram juntas");
            }
            try {
                resgates.resgatar(beneficioId, usuario);
                return true;
            } catch (BeneficioIndisponivelException ex) {
                return false;
            }
        };
    }
}
