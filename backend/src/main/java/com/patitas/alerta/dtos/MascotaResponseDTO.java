package com.patitas.alerta.dtos;

import lombok.Data;
import java.util.UUID;

@Data
public class MascotaResponseDTO {
    private UUID id;
    private String nombreDueno;
    private String nombre;
    private String especie;
    private String estadoAdopcion;
    private String nivelEnergia;
    private String tamano;
    private String caracteristicas;
}
