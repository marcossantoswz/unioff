package com.unioff.controller;

import com.unioff.dto.EmpresaResponseDTO;
import com.unioff.dto.EmpresaUpdateDTO;
import com.unioff.services.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @GetMapping("/me")
    public ResponseEntity<EmpresaResponseDTO> getMinhaEmpresa(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        EmpresaResponseDTO response = empresaService.getMinhaEmpresa(principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<EmpresaResponseDTO> updateMinhaEmpresa(
            Principal principal,
            @RequestBody EmpresaUpdateDTO dto) {
        
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        EmpresaResponseDTO response = empresaService.updateMinhaEmpresa(principal.getName(), dto);
        return ResponseEntity.ok(response);
    }
}
