package com.unioff.exceptions;

public class BeneficioIndisponivelException extends RuntimeException {
    public BeneficioIndisponivelException() {
        super("Benefício indisponível para resgate");
    }
}
