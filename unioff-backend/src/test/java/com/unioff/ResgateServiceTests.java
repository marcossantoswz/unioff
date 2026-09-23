package com.unioff;

import com.unioff.entity.Beneficio;
import com.unioff.entity.Empresa;
import com.unioff.entity.StatusCupom;
import com.unioff.entity.Usuario;
import com.unioff.exceptions.BeneficioIndisponivelException;
import com.unioff.exceptions.CupomInvalidoException;
import com.unioff.exceptions.ResgateDuplicadoException;
import com.unioff.exceptions.ResourceNotFoundException;
import com.unioff.repository.BeneficioRepository;
import com.unioff.repository.CupomRepository;
import com.unioff.repository.EmpresaRepository;
import com.unioff.repository.UsuarioRepository;
import com.unioff.services.CupomService;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ResgateServiceTests {
    @Autowired CupomService service;
    @Autowired BeneficioRepository beneficios;
    @Autowired CupomRepository cupons;
    @Autowired EmpresaRepository empresas;
    @Autowired UsuarioRepository usuarios;
    @Autowired EntityManager entityManager;
    Usuario estudante;
    Beneficio beneficio;

    @BeforeEach
    void preparar() {
        estudante = usuarios.findByEmail("estudante@teste.com").orElseThrow();
        Usuario dono = usuarios.findByEmail("empresa@teste.com").orElseThrow();
        Empresa empresa = empresas.findById(dono.getId()).orElseThrow();
        beneficio = new Beneficio();
        beneficio.setEmpresa(empresa);
        beneficio.setTitulo("Desconto de teste");
        beneficio.setDescricao("Válido para teste");
        beneficio.setDataInicio(LocalDate.now());
        beneficio.setDataFim(LocalDate.now().plusDays(1));
        beneficio.setQuantidadeMaxResgastes(1);
        beneficio = beneficios.saveAndFlush(beneficio);
    }

    @Test
    void geraCupomPendenteEIncrementaContador() {
        var cupom = service.resgatar(beneficio.getId(), estudante);
        assertNotNull(cupom.getId());
        assertTrue(cupom.getCodigo().startsWith("UNI-"));
        assertEquals(StatusCupom.PENDENTE, cupom.getStatus());
        assertNotNull(cupom.getDataGeracao());
        assertTrue(cupons.existsByEstudanteIdAndBeneficioId(estudante.getId(), beneficio.getId()));
        entityManager.clear();
        assertEquals(1, beneficios.findById(beneficio.getId()).orElseThrow().getQuantidadeResgates());
    }

    @Test
    void recusaSegundoResgateDoMesmoEstudante() {
        service.resgatar(beneficio.getId(), estudante);
        assertThrows(ResgateDuplicadoException.class,
                () -> service.resgatar(beneficio.getId(), estudante));
    }

    @Test
    void recusaBeneficioInativoOuForaDaValidade() {
        beneficio.setAtivo(false);
        beneficios.flush();
        assertThrows(BeneficioIndisponivelException.class,
                () -> service.resgatar(beneficio.getId(), estudante));
    }

    @Test
    void recusaBeneficioExpirado() {
        beneficio.setDataFim(LocalDate.now().minusDays(1));
        beneficios.flush();
        assertThrows(BeneficioIndisponivelException.class,
                () -> service.resgatar(beneficio.getId(), estudante));
    }

    @Test
    void informaBeneficioInexistente() {
        assertThrows(ResourceNotFoundException.class,
                () -> service.resgatar(UUID.randomUUID(), estudante));
    }

    @Test
    void empresaDonaValidaCupomPendente() {
        var cupom = service.resgatar(beneficio.getId(), estudante);
        Usuario empresa = usuarios.findByEmail("empresa@teste.com").orElseThrow();
        var validado = service.validar(cupom.getCodigo(), empresa);
        assertEquals(StatusCupom.USADO, validado.getStatus());
        assertNotNull(validado.getDataUso());
    }

    @Test
    void recusaCupomJaUtilizado() {
        var cupom = service.resgatar(beneficio.getId(), estudante);
        Usuario empresa = usuarios.findByEmail("empresa@teste.com").orElseThrow();
        service.validar(cupom.getCodigo(), empresa);
        assertThrows(CupomInvalidoException.class,
                () -> service.validar(cupom.getCodigo(), empresa));
    }

    @Test
    void recusaValidacaoPorQuemNaoEDono() {
        var cupom = service.resgatar(beneficio.getId(), estudante);
        assertThrows(CupomInvalidoException.class,
                () -> service.validar(cupom.getCodigo(), estudante));
    }

    @Test
    void estudanteConsultaSeusCuponsMaisRecentesPrimeiro() {
        var cupom = service.resgatar(beneficio.getId(), estudante);
        var resultado = service.listarDoEstudante(estudante.getId());
        assertEquals(cupom.getCodigo(), resultado.get(0).codigo());
        assertEquals("Desconto de teste", resultado.get(0).beneficioTitulo());
        assertEquals(estudante.getNome(), resultado.get(0).estudanteNome());
    }

    @Test
    void empresaConsultaCuponsDeSeusBeneficios() {
        var cupom = service.resgatar(beneficio.getId(), estudante);
        var resultado = service.listarDaEmpresa("empresa@teste.com");
        assertTrue(resultado.stream().anyMatch(item -> item.codigo().equals(cupom.getCodigo())));
        assertTrue(service.listarDaEmpresa("outra@empresa.com").isEmpty());
    }
}
