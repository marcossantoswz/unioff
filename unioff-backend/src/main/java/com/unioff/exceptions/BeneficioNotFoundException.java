package com.unioff.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BeneficioNotFoundException extends RuntimeException {
    public BeneficioNotFoundException(String message) {
        super(message);
    }
}
