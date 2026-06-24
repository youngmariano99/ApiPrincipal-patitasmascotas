package com.patitas.alerta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroRequest {
    private String email;
    private String password;
    private String nombreCompleto;
    private String telefono;
}
