package com.unioff.exceptions;

public class UsuarioInativoException extends RuntimeException {

    public UsuarioInativoException() {
        super("Usuário inativo.");
    }
}