package com.patitas.alerta.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class MascotaRequestDTO {
    @NotNull(message = "El ID del dueño es obligatorio")
    private UUID usuarioId;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La especie es obligatoria")
    private String especie;

    @NotBlank(message = "El estado de adopción es obligatorio")
    private String estadoAdopcion;

    @NotBlank(message = "El nivel de energía es obligatorio")
    private String nivelEnergia;

    @NotBlank(message = "El tamaño es obligatorio")
    private String tamano;

    @NotBlank(message = "Las características son obligatorias")
    private String caracteristicas; // Un JSON como string
}
