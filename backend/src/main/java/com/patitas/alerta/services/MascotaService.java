package com.patitas.alerta.services;

import com.patitas.alerta.dtos.MascotaRequestDTO;
import com.patitas.alerta.dtos.MascotaResponseDTO;
import com.patitas.alerta.entities.Mascota;
import com.patitas.alerta.entities.Usuario;
import com.patitas.alerta.mappers.MascotaMapper;
import com.patitas.alerta.repositories.MascotaRepository;
import com.patitas.alerta.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MascotaService {

    @Autowired
    private MascotaRepository mascotaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MascotaMapper mascotaMapper;

    @Transactional(readOnly = true)
    public List<MascotaResponseDTO> obtenerTodas() {
        return mascotaRepository.findAll().stream()
                .map(mascotaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MascotaResponseDTO obtenerPorId(UUID id) {
        Mascota mascota = mascotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
        return mascotaMapper.toResponseDTO(mascota);
    }

    @Transactional(readOnly = true)
    public List<MascotaResponseDTO> buscarPorDueno(UUID duenoId) {
        return mascotaRepository.findByUsuarioId(duenoId).stream()
                .map(mascotaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MascotaResponseDTO crearMascota(MascotaRequestDTO dto) {
        Usuario dueno = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Mascota mascota = new Mascota();
        mascota.setUsuario(dueno);
        mascota.setNombre(dto.getNombre());
        mascota.setEspecie(dto.getEspecie());
        mascota.setEstadoAdopcion(dto.getEstadoAdopcion());
        mascota.setNivelEnergia(dto.getNivelEnergia());
        mascota.setTamano(dto.getTamano());
        mascota.setCaracteristicas(dto.getCaracteristicas());

        mascota = mascotaRepository.save(mascota);
        return mascotaMapper.toResponseDTO(mascota);
    }

    @Transactional
    public MascotaResponseDTO actualizarMascota(UUID id, MascotaRequestDTO dto) {
        Mascota mascota = mascotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        Usuario dueno = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        mascota.setUsuario(dueno);
        mascota.setNombre(dto.getNombre());
        mascota.setEspecie(dto.getEspecie());
        mascota.setEstadoAdopcion(dto.getEstadoAdopcion());
        mascota.setNivelEnergia(dto.getNivelEnergia());
        mascota.setTamano(dto.getTamano());
        mascota.setCaracteristicas(dto.getCaracteristicas());

        mascota = mascotaRepository.save(mascota);
        return mascotaMapper.toResponseDTO(mascota);
    }

    @Transactional
    public void eliminarMascota(UUID id) {
        Mascota mascota = mascotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
        mascotaRepository.delete(mascota);
    }
}
