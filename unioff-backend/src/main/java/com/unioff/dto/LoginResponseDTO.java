package com.unioff.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private UsuarioResumoDTO usuario;
}