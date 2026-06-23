package com.patitas.alerta.dtos;

import lombok.Data;
import java.util.UUID;

@Data
public class UsuarioResponseDTO {
    private UUID id;
    private String email;
    private String rol;
    private String nombreCompleto;
}
