package com.unioff.service;

import com.unioff.dto.*;
import com.unioff.entity.*;
import com.unioff.exceptions.*;
import com.unioff.repository.*;
import com.unioff.services.EmpresaService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmpresaServiceTest {

    @Mock private EmpresaRepository empresaRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private BeneficioRepository beneficioRepository;
    @Mock private CupomRepository cupomRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private EmpresaService service;

    private Empresa empresa;
    private Beneficio beneficio;

    @BeforeEach
    void setUp() {
        Usuario u = new Usuario();
        u.setId(UUID.randomUUID()); u.setNome("Empresa"); u.setEmail("empresa@teste.com");
        empresa = new Empresa();
        empresa.setId(u.getId()); empresa.setUsuario(u);
        empresa.setNomeFantasia("Cafe Uni"); empresa.setCidade("BH"); empresa.setBairro("Centro");
        beneficio = new Beneficio();
        beneficio.setId(UUID.randomUUID()); beneficio.setTitulo("10% OFF");
        beneficio.setQuantidadeResgates(2); beneficio.setQuantidadeMaxResgastes(5); beneficio.setAtivo(true);
        empresa.setBeneficios(List.of(beneficio));
    }

    @Test
    void getMinhaEmpresaEListarEmpresas() {
        when(empresaRepository.findByUsuarioEmail("empresa@teste.com")).thenReturn(Optional.of(empresa));
        assertEquals("Cafe Uni", service.getMinhaEmpresa("empresa@teste.com").getNomeFantasia());
        when(empresaRepository.findByUsuarioEmail("x@x.com")).thenReturn(Optional.empty());
        assertThrows(EmpresaNotFoundException.class, () -> service.getMinhaEmpresa("x@x.com"));
        Pageable p = PageRequest.of(0, 10);
        when(empresaRepository.findByFiltros("Cafe", "BH", "Centro", p)).thenReturn(new PageImpl<>(List.of(empresa)));
        assertEquals(1, service.listarEmpresas("Cafe", "BH", "Centro", p).getTotalElements());
    }

    @Test
    void updateMinhaEmpresa() {
        EmpresaUpdateDTO dto = new EmpresaUpdateDTO();
        dto.setNome("Novo"); dto.setNomeFantasia("Nova"); dto.setDescricao("Desc");
        dto.setCidade("SP"); dto.setBairro("Sul"); dto.setLogradouro("Rua A");
        dto.setNumero("10"); dto.setTelephoneWhatsapp("999"); dto.setSite("site.com");
        when(empresaRepository.findByUsuarioEmail("empresa@teste.com")).thenReturn(Optional.of(empresa));
        when(empresaRepository.save(any())).thenReturn(empresa);
        assertEquals("Nova", service.updateMinhaEmpresa("empresa@teste.com", dto).getNomeFantasia());
        verify(usuarioRepository).save(empresa.getUsuario());
        when(empresaRepository.findByUsuarioEmail("nao@existe.com")).thenReturn(Optional.empty());
        assertThrows(EmpresaNotFoundException.class, () -> service.updateMinhaEmpresa("nao@existe.com", dto));
    }

    @Test
    void beneficiosDetalhesEMetricas() {
        Pageable p = PageRequest.of(0, 10);
        when(beneficioRepository.findBeneficiosDaEmpresa("empresa@teste.com", true, false, p)).thenReturn(new PageImpl<>(List.of(beneficio)));
        assertEquals(3, service.getBeneficiosDaEmpresa("empresa@teste.com", true, false, p).getContent().get(0).getQuantidadeDisponivel());
        when(empresaRepository.findById(empresa.getId())).thenReturn(Optional.of(empresa));
        assertEquals(1, service.getDetalhesEmpresa(empresa.getId()).getBeneficios().size());
        assertThrows(EmpresaNotFoundException.class, () -> service.getDetalhesEmpresa(UUID.randomUUID()));
        when(empresaRepository.findByUsuarioEmail("empresa@teste.com")).thenReturn(Optional.of(empresa));
        when(cupomRepository.countCuponsPorBeneficioStatus(empresa.getId(), StatusCupom.USADO))
                .thenReturn(List.<Object[]>of(new Object[]{beneficio.getId(), 1L}));
        MetricasEmpresaDTO m = service.getMetricas("empresa@teste.com");
        assertEquals(1L, m.getTotalBeneficiosAtivos());
        assertEquals(1L, m.getTotalCuponsUtilizados());
    }

    @Test
    void cadastrar() {
        when(usuarioRepository.existsByEmail("dup@teste.com")).thenReturn(true);
        assertThrows(EmailJaCadastradoException.class, () -> service.cadastrar("N", "dup@teste.com", "123", "F", "1", "D", "C", "B", "L", "1", "9", "s"));
        when(usuarioRepository.existsByEmail("novo@teste.com")).thenReturn(false);
        when(passwordEncoder.encode("123")).thenReturn("hash");
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(empresaRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        assertEquals("Fantasia", service.cadastrar("N", "novo@teste.com", "123", "Fantasia", "12345", "D", "BH", "Centro", "Rua", "1", "9", "site").getNomeFantasia());
    }
}
