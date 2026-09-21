package com.unioff.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNaoEncontrado(
            ResourceNotFoundException ex, HttpServletRequest request
    ) {
        return montarResposta(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler({BeneficioIndisponivelException.class, ResgateDuplicadoException.class,
            CupomInvalidoException.class})
    public ResponseEntity<Map<String, Object>> handleConflito(
            RuntimeException ex, HttpServletRequest request
    ) {
        return montarResposta(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(EmailJaCadastradoException.class)
    public ResponseEntity<Map<String, Object>> handleEmailJaCadastrado(
            EmailJaCadastradoException ex, HttpServletRequest request
    ) {
        return montarResposta(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<Map<String, Object>> handleCredenciaisInvalidas(
            CredenciaisInvalidasException ex, HttpServletRequest request
    ) {
        return montarResposta(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    @ExceptionHandler(UsuarioInativoException.class)
    public ResponseEntity<Map<String, Object>> handleUsuarioInativo(
            UsuarioInativoException ex, HttpServletRequest request
    ) {
        return montarResposta(HttpStatus.FORBIDDEN, ex.getMessage(), request);
    }

    private ResponseEntity<Map<String, Object>> montarResposta(
            HttpStatus status, String mensagem, HttpServletRequest request
    ) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("status", status.value());
        corpo.put("error", status.getReasonPhrase());
        corpo.put("message", mensagem);
        corpo.put("path", request.getRequestURI());
        corpo.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(status).body(corpo);
    }
}
