package com.patitas.alerta.services;

import com.patitas.alerta.dtos.MascotaRequestDTO;
import com.patitas.alerta.dtos.MascotaResponseDTO;
import com.patitas.alerta.entities.Mascota;
import com.patitas.alerta.entities.Usuario;
import com.patitas.alerta.mappers.MascotaMapper;
import com.patitas.alerta.repositories.MascotaRepository;
import com.patitas.alerta.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MascotaServiceTest {

    @Mock
    private MascotaRepository mascotaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private MascotaMapper mascotaMapper;

    @InjectMocks
    private MascotaService mascotaService;

    private Usuario duenoMock;
    private Mascota mascotaMock;
    private MascotaRequestDTO requestDTO;
    private MascotaResponseDTO responseDTO;
    private UUID duenoId;

    @BeforeEach
    void setUp() {
        duenoId = UUID.randomUUID();
        
        duenoMock = new Usuario();
        duenoMock.setId(duenoId);
        duenoMock.setNombreCompleto("Juan Test");

        mascotaMock = new Mascota();
        mascotaMock.setId(UUID.randomUUID());
        mascotaMock.setUsuario(duenoMock);
        mascotaMock.setNombre("Firulais Test");

        requestDTO = new MascotaRequestDTO();
        requestDTO.setUsuarioId(duenoId);
        requestDTO.setNombre("Firulais Test");
        requestDTO.setEspecie("CANINO");
        requestDTO.setEstadoAdopcion("CON_DUENO");
        requestDTO.setNivelEnergia("ALTO");
        requestDTO.setTamano("MEDIANO");
        requestDTO.setCaracteristicas("{}");

        responseDTO = new MascotaResponseDTO();
        responseDTO.setNombre("Firulais Test");
    }

    @Test
    void crearMascota_DebeRetornarMascota_CuandoDuenoExiste() {
        // Arrange
        when(usuarioRepository.findById(duenoId)).thenReturn(Optional.of(duenoMock));
        when(mascotaRepository.save(any(Mascota.class))).thenReturn(mascotaMock);
        when(mascotaMapper.toResponseDTO(any(Mascota.class))).thenReturn(responseDTO);

        // Act
        MascotaResponseDTO resultado = mascotaService.crearMascota(requestDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals("Firulais Test", resultado.getNombre());
        verify(mascotaRepository, times(1)).save(any(Mascota.class));
    }

    @Test
    void crearMascota_DebeLanzarExcepcion_CuandoDuenoNoExiste() {
        // Arrange
        when(usuarioRepository.findById(duenoId)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            mascotaService.crearMascota(requestDTO);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(mascotaRepository, never()).save(any(Mascota.class));
    }
}
