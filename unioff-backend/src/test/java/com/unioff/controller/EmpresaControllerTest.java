package com.unioff.controller;

import com.unioff.controller.EmpresaController;
import com.unioff.dto.*;
import com.unioff.services.EmpresaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmpresaControllerTest {

    @Mock private EmpresaService empresaService;
    @InjectMocks private EmpresaController controller;

    private final Principal principal = () -> "empresa@teste.com";
    private final Pageable pageable = PageRequest.of(0, 10);

    @Test
    void getMinhaEmpresa() {
        assertEquals(401, controller.getMinhaEmpresa(null).getStatusCode().value());

        EmpresaResponseDTO dto = new EmpresaResponseDTO();
        dto.setNomeFantasia("Cafe Uni");
        when(empresaService.getMinhaEmpresa("empresa@teste.com")).thenReturn(dto);

        ResponseEntity<EmpresaResponseDTO> res = controller.getMinhaEmpresa(principal);
        assertEquals(200, res.getStatusCode().value());
        assertEquals("Cafe Uni", res.getBody().getNomeFantasia());
    }

    @Test
    void updateMinhaEmpresa() {
        EmpresaUpdateDTO update = new EmpresaUpdateDTO();
        update.setNomeFantasia("Novo Nome");
        assertEquals(401, controller.updateMinhaEmpresa(null, update).getStatusCode().value());

        EmpresaResponseDTO dto = new EmpresaResponseDTO();
        dto.setNomeFantasia("Novo Nome");
        when(empresaService.updateMinhaEmpresa("empresa@teste.com", update)).thenReturn(dto);

        ResponseEntity<EmpresaResponseDTO> res = controller.updateMinhaEmpresa(principal, update);
        assertEquals(200, res.getStatusCode().value());
        assertEquals("Novo Nome", res.getBody().getNomeFantasia());
    }

    @Test
    void getMeusBeneficios() {
        assertEquals(401, controller.getMeusBeneficios(null, true, false, pageable).getStatusCode().value());

        Page<BeneficioResponseDTO> page = new PageImpl<>(List.of(new BeneficioResponseDTO()));
        when(empresaService.getBeneficiosDaEmpresa("empresa@teste.com", true, false, pageable)).thenReturn(page);

        ResponseEntity<Page<BeneficioResponseDTO>> res = controller.getMeusBeneficios(principal, true, false, pageable);
        assertEquals(200, res.getStatusCode().value());
        assertEquals(1, res.getBody().getTotalElements());
    }

    @Test
    void listarEmpresasEVisualizarDetalhes() {
        Page<EmpresaResponseDTO> page = new PageImpl<>(List.of(new EmpresaResponseDTO()));
        when(empresaService.listarEmpresas("Cafe", "BH", "Centro", pageable)).thenReturn(page);
        assertEquals(1, controller.listarEmpresas("Cafe", "BH", "Centro", pageable).getBody().getTotalElements());

        UUID id = UUID.randomUUID();
        EmpresaDetalhesDTO detalhes = new EmpresaDetalhesDTO();
        detalhes.setId(id);
        when(empresaService.getDetalhesEmpresa(id)).thenReturn(detalhes);
        assertEquals(id, controller.visualizarDetalhesEmpresa(id).getBody().getId());
    }

    @Test
    void getMinhasMetricas() {
        assertEquals(401, controller.getMinhasMetricas(null).getStatusCode().value());

        MetricasEmpresaDTO metricas = new MetricasEmpresaDTO();
        metricas.setTotalBeneficios(3L);
        when(empresaService.getMetricas("empresa@teste.com")).thenReturn(metricas);

        ResponseEntity<MetricasEmpresaDTO> res = controller.getMinhasMetricas(principal);
        assertEquals(200, res.getStatusCode().value());
        assertEquals(3L, res.getBody().getTotalBeneficios());
    }
}
