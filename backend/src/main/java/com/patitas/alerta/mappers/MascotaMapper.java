package com.patitas.alerta.mappers;

import com.patitas.alerta.dtos.MascotaResponseDTO;
import com.patitas.alerta.entities.Mascota;
import org.springframework.stereotype.Component;

@Component
public class MascotaMapper {
    public MascotaResponseDTO toResponseDTO(Mascota mascota) {
        if (mascota == null) return null;
        
        MascotaResponseDTO dto = new MascotaResponseDTO();
        dto.setId(mascota.getId());
        dto.setNombreDueno(mascota.getUsuario() != null ? mascota.getUsuario().getNombreCompleto() : "Sin Dueño");
        dto.setNombre(mascota.getNombre());
        dto.setEspecie(mascota.getEspecie());
        dto.setEstadoAdopcion(mascota.getEstadoAdopcion());
        dto.setNivelEnergia(mascota.getNivelEnergia());
        dto.setTamano(mascota.getTamano());
        dto.setCaracteristicas(mascota.getCaracteristicas());
        
        return dto;
    }
}
