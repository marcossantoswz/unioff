package com.unioff.controller;

import com.unioff.dto.CupomConsultaDTO;
import com.unioff.dto.ResgateResponseDTO;
import com.unioff.dto.ValidacaoCupomRequestDTO;
import com.unioff.entity.Cupom;
import com.unioff.entity.StatusCupom;
import com.unioff.entity.Usuario;
import com.unioff.entity.Beneficio;
import com.unioff.services.CupomService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResgateControllerTest {
    @Mock private CupomService cupomService;
    @InjectMocks private ResgateController controller;

    @Test
    void listarDoEstudanteUsaIdDoUsuarioAutenticado() {
        UUID estudanteId = UUID.randomUUID();
        Usuario estudante = new Usuario();
        estudante.setId(estudanteId);

        CupomConsultaDTO cupom = new CupomConsultaDTO(
                UUID.randomUUID(), "UNI-TESTE", StatusCupom.PENDENTE,
                LocalDateTime.now(), null, UUID.randomUUID(),
                "Desconto", estudanteId, "Estudante", "Empresa");

        when(cupomService.listarDoEstudante(estudanteId)).thenReturn(List.of(cupom));

        List<CupomConsultaDTO> resultado = controller.listarDoEstudante(estudante);

        assertEquals(1, resultado.size());
        assertEquals("UNI-TESTE", resultado.get(0).codigo());
        verify(cupomService).listarDoEstudante(estudanteId);}

    @Test
    void resgatarRetornaCupomCriado() {
        UUID beneficioId = UUID.randomUUID();
        Usuario estudante = new Usuario();
        Cupom cupom = novoCupom();

        when(cupomService.resgatar(beneficioId, estudante)).thenReturn(cupom);

        var response = controller.resgatar(beneficioId, estudante);
        ResgateResponseDTO resposta = response.getBody();

        assertNotNull(resposta);
        assertEquals(cupom.getCodigo(), resposta.codigo());
        assertEquals(201, response.getStatusCode().value());
        verify(cupomService).resgatar(beneficioId, estudante);}

    @Test
    void validarRetornaCupomUtilizado() {
        Usuario empresa = new Usuario();
        Cupom cupom = novoCupom();
        cupom.setStatus(StatusCupom.USADO);
        ValidacaoCupomRequestDTO request = new ValidacaoCupomRequestDTO(cupom.getCodigo());

        when(cupomService.validar(cupom.getCodigo(), empresa)).thenReturn(cupom);

        ResgateResponseDTO resposta = controller.validar(request, empresa).getBody();

        assertNotNull(resposta);
        assertEquals(StatusCupom.USADO, resposta.status());
        verify(cupomService).validar(cupom.getCodigo(), empresa);
    }

    @Test
    void listarDaEmpresaDelegaParaEmailDaEmpresa() {
        Usuario empresa = new Usuario();
        empresa.setEmail("empresa@teste.com");
        when(cupomService.listarDaEmpresa("empresa@teste.com")).thenReturn(List.of());

        assertEquals(0, controller.listarDaEmpresa(empresa).size());
        verify(cupomService).listarDaEmpresa("empresa@teste.com");
    }

    private Cupom novoCupom() {
        Cupom cupom = new Cupom();
        cupom.setId(UUID.randomUUID());
        cupom.setCodigo("UNI-TESTE");
        cupom.setStatus(StatusCupom.PENDENTE);
        cupom.setDataGeracao(LocalDateTime.now());
        Beneficio beneficio = new Beneficio();
        beneficio.setId(UUID.randomUUID());
        cupom.setBeneficio(beneficio);
        return cupom;}
}