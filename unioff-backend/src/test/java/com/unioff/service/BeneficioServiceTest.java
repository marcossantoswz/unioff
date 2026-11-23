package com.unioff.service;

import com.unioff.dto.*;
import com.unioff.entity.*;
import com.unioff.exceptions.*;
import com.unioff.repository.*;
import com.unioff.services.BeneficioService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficioServiceTest {

    private static final String EMAIL_DONA = "empresa@teste.com";
    @Mock private BeneficioRepository beneficioRepository;
    @Mock private EmpresaRepository empresaRepository;
    @InjectMocks private BeneficioService service;

    private Empresa empresa;
    private Beneficio beneficio;

    @BeforeEach
    void setUp() {
        Usuario u = new Usuario();
        u.setId(UUID.randomUUID()); u.setEmail(EMAIL_DONA);
        empresa = new Empresa();
        empresa.setId(u.getId()); empresa.setUsuario(u); empresa.setNomeFantasia("Cafe Uni");
        beneficio = new Beneficio();
        beneficio.setId(UUID.randomUUID()); beneficio.setTitulo("10% OFF"); beneficio.setDescricao("Almoco");
        beneficio.setDataInicio(LocalDate.now()); beneficio.setDataFim(LocalDate.now().plusDays(10));
        beneficio.setQuantidadeResgates(2); beneficio.setQuantidadeMaxResgastes(5); beneficio.setEmpresa(empresa);
    }

    private BeneficioRequestDTO requestValido() {
        BeneficioRequestDTO dto = new BeneficioRequestDTO();
        dto.setTitulo("Combo estudante"); dto.setDescricao("Lanche + suco");
        dto.setDataInicio(LocalDate.now()); dto.setDataFim(LocalDate.now().plusDays(7));
        dto.setQuantidadeMaxResgastes(20);
        return dto;
    }

    @Test
    void cadastrarCriaBeneficioAtivoSemResgatesEVinculadoAEmpresa() {
        when(empresaRepository.findByUsuarioEmail(EMAIL_DONA)).thenReturn(Optional.of(empresa));
        when(beneficioRepository.save(any(Beneficio.class))).thenAnswer(inv -> inv.getArgument(0));
        BeneficioResponseDTO resposta = service.cadastrarBeneficio(EMAIL_DONA, requestValido());

        assertEquals("Combo estudante", resposta.getTitulo());
        assertEquals(0, resposta.getQuantidadeResgates());
        assertEquals(20, resposta.getQuantidadeDisponivel());
        assertTrue(resposta.getAtivo());
        assertFalse(resposta.getEsgotado());
        assertEquals(empresa.getId(), resposta.getEmpresaId());
        assertEquals("Cafe Uni", resposta.getNomeEmpresa());
    }

    @Test
    void cadastrarRecusaDataFimAnteriorAoInicioEEmpresaInexistente() {
        BeneficioRequestDTO dto = requestValido();
        dto.setDataFim(dto.getDataInicio().minusDays(1));
        assertThrows(IllegalArgumentException.class, () -> service.cadastrarBeneficio(EMAIL_DONA, dto));
        verify(beneficioRepository, never()).save(any());
        when(empresaRepository.findByUsuarioEmail("nao@existe.com")).thenReturn(Optional.empty());
        assertThrows(EmpresaNotFoundException.class,
                () -> service.cadastrarBeneficio("nao@existe.com", requestValido()));
    }

    @Test
    void buscarPorIdRetornaDtoOuLancaNotFound() {
        when(beneficioRepository.findById(beneficio.getId())).thenReturn(Optional.of(beneficio));
        BeneficioResponseDTO resposta = service.buscarPorId(beneficio.getId());
        assertEquals("10% OFF", resposta.getTitulo());
        assertEquals(3, resposta.getQuantidadeDisponivel());
        UUID inexistente = UUID.randomUUID();
        when(beneficioRepository.findById(inexistente)).thenReturn(Optional.empty());
        assertThrows(BeneficioNotFoundException.class, () -> service.buscarPorId(inexistente));
    }

    @Test
    void listarFeedDelegaAoRepositorioEMapeiaPagina() {
        Pageable pageable = PageRequest.of(0, 10);
        beneficio.setQuantidadeResgates(5);
        when(beneficioRepository.findBeneficiosFeed("off", null, pageable))
                .thenReturn(new PageImpl<>(List.of(beneficio)));
        Page<BeneficioResponseDTO> pagina = service.listarFeed("off", null, pageable);

        assertEquals(1, pagina.getTotalElements());
        assertTrue(pagina.getContent().get(0).getEsgotado());
        assertEquals(0, pagina.getContent().get(0).getQuantidadeDisponivel());
    }

    @Test
    void atualizarAplicaSomenteCamposInformados() {
        when(beneficioRepository.findById(beneficio.getId())).thenReturn(Optional.of(beneficio));
        when(beneficioRepository.save(any(Beneficio.class))).thenAnswer(inv -> inv.getArgument(0));
        BeneficioUpdateDTO dto = new BeneficioUpdateDTO();
        dto.setTitulo("15% OFF"); dto.setQuantidadeMaxResgastes(8); dto.setAtivo(false);

        BeneficioResponseDTO resposta = service.atualizarBeneficio(beneficio.getId(), EMAIL_DONA, dto);

        assertEquals("15% OFF", resposta.getTitulo());
        assertEquals("Almoco", resposta.getDescricao());
        assertEquals(6, resposta.getQuantidadeDisponivel());
        assertFalse(resposta.getAtivo());
    }

    @Test
    void atualizarRecusaIdInexistenteOutraEmpresaEDatasInvertidas() {
        BeneficioUpdateDTO dto = new BeneficioUpdateDTO();
        UUID inexistente = UUID.randomUUID();
        when(beneficioRepository.findById(inexistente)).thenReturn(Optional.empty());
        assertThrows(BeneficioNotFoundException.class,
                () -> service.atualizarBeneficio(inexistente, EMAIL_DONA, dto));

        when(beneficioRepository.findById(beneficio.getId())).thenReturn(Optional.of(beneficio));
        assertThrows(SecurityException.class,
                () -> service.atualizarBeneficio(beneficio.getId(), "outra@empresa.com", dto));

        dto.setDataFim(beneficio.getDataInicio().minusDays(1));
        assertThrows(IllegalArgumentException.class,
                () -> service.atualizarBeneficio(beneficio.getId(), EMAIL_DONA, dto));
        verify(beneficioRepository, never()).save(any());
    }

    @Test
    void excluirDesativaQuandoDonoOuAdmin() {
        when(beneficioRepository.findById(beneficio.getId())).thenReturn(Optional.of(beneficio));

        service.excluirBeneficio(beneficio.getId(), EMAIL_DONA, false);
        assertFalse(beneficio.isAtivo());

        beneficio.setAtivo(true);
        service.excluirBeneficio(beneficio.getId(), "admin@unioff.com", true);
        assertFalse(beneficio.isAtivo());
        verify(beneficioRepository, times(2)).save(beneficio);
    }

    @Test
    void excluirRecusaQuemNaoEDonoNemAdminEIdInexistente() {
        when(beneficioRepository.findById(beneficio.getId())).thenReturn(Optional.of(beneficio));
        assertThrows(SecurityException.class,
                () -> service.excluirBeneficio(beneficio.getId(), "outra@empresa.com", false));
        assertTrue(beneficio.isAtivo());

        UUID inexistente = UUID.randomUUID();
        when(beneficioRepository.findById(inexistente)).thenReturn(Optional.empty());
        assertThrows(BeneficioNotFoundException.class,
                () -> service.excluirBeneficio(inexistente, EMAIL_DONA, true));
        verify(beneficioRepository, never()).save(any());
    }
}
