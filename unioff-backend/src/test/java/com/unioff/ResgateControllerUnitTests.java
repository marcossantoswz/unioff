package com.unioff;

import com.unioff.controller.ResgateController;
import com.unioff.dto.CupomConsultaDTO;
import com.unioff.dto.ValidacaoCupomRequestDTO;
import com.unioff.entity.Beneficio;
import com.unioff.entity.Cupom;
import com.unioff.entity.StatusCupom;
import com.unioff.entity.Usuario;
import com.unioff.services.CupomService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResgateControllerUnitTests {
    @Mock CupomService service;
    ResgateController controller;
    Usuario usuario;
    Cupom cupom;
    UUID beneficioId;

    @BeforeEach
    void preparar() {
        controller = new ResgateController(service);
        beneficioId = UUID.randomUUID();
        usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setEmail("usuario@teste.com");
        Beneficio beneficio = new Beneficio();
        beneficio.setId(beneficioId);
        cupom = new Cupom();
        cupom.setId(UUID.randomUUID());
        cupom.setCodigo("UNI-TESTE");
        cupom.setStatus(StatusCupom.PENDENTE);
        cupom.setDataGeracao(LocalDateTime.now());
        cupom.setBeneficio(beneficio);
    }

    @Test
    void criaResgate() {
        when(service.resgatar(beneficioId, usuario)).thenReturn(cupom);
        var resposta = controller.resgatar(beneficioId, usuario);
        assertEquals(201, resposta.getStatusCode().value());
        assertEquals("UNI-TESTE", resposta.getBody().codigo());
        verify(service).resgatar(beneficioId, usuario);
    }

    @Test
    void validaCupom() {
        when(service.validar("UNI-TESTE", usuario)).thenReturn(cupom);
        var resposta = controller.validar(new ValidacaoCupomRequestDTO("UNI-TESTE"), usuario);
        assertEquals(200, resposta.getStatusCode().value());
        assertEquals(beneficioId, resposta.getBody().beneficioId());
    }

    @Test
    void listaCuponsDoEstudante() {
        List<CupomConsultaDTO> esperado = List.of(mock(CupomConsultaDTO.class));
        when(service.listarDoEstudante(usuario.getId())).thenReturn(esperado);
        assertSame(esperado, controller.listarDoEstudante(usuario));
        verify(service).listarDoEstudante(usuario.getId());
    }

    @Test
    void listaCuponsDaEmpresa() {
        List<CupomConsultaDTO> esperado = List.of(mock(CupomConsultaDTO.class));
        when(service.listarDaEmpresa(usuario.getEmail())).thenReturn(esperado);
        assertSame(esperado, controller.listarDaEmpresa(usuario));
        verify(service).listarDaEmpresa(usuario.getEmail());
    }
}
