package com.unioff.exceptions;

public class ResgateDuplicadoException extends RuntimeException {
    public ResgateDuplicadoException() {
        super("Este benefício já foi resgatado pelo estudante");
    }
}
