package com.unioff.exceptions;

public class CupomInvalidoException extends RuntimeException {
    public CupomInvalidoException() {
        super("Cupom inválido, já utilizado ou pertencente a outra empresa");
    }
}
