package com.patitas.alerta.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.patitas.alerta.dtos.MascotaRequestDTO;
import com.patitas.alerta.dtos.MascotaResponseDTO;
import com.patitas.alerta.security.JwtUtil;
import com.patitas.alerta.security.UserDetailsServiceImpl;
import com.patitas.alerta.services.MascotaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MascotaController.class)
@AutoConfigureMockMvc(addFilters = false) // Desactiva filtros de Seguridad/JWT solo para probar el Controller aislado
class MascotaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MascotaService mascotaService;

    // Se mockean beans de seguridad para evitar que el contexto de Spring explote al faltarles implementaciones en test
    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void crearMascota_DebeRetornar201_CuandoRequestEsValido() throws Exception {
        // Arrange
        MascotaRequestDTO request = new MascotaRequestDTO();
        request.setUsuarioId(UUID.randomUUID());
        request.setNombre("Boby");
        request.setEspecie("CANINO");
        request.setEstadoAdopcion("CON_DUENO");
        request.setNivelEnergia("ALTO");
        request.setTamano("MEDIANO");
        request.setCaracteristicas("{}");

        MascotaResponseDTO response = new MascotaResponseDTO();
        response.setNombre("Boby");

        when(mascotaService.crearMascota(any(MascotaRequestDTO.class))).thenReturn(response);

        ObjectMapper mapper = new ObjectMapper();

        // Act & Assert
        mockMvc.perform(post("/api/v1/mascotas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Boby"));
    }
    
    @Test
    void crearMascota_DebeRetornar400_CuandoRequestEsInvalido() throws Exception {
        // Arrange
        MascotaRequestDTO request = new MascotaRequestDTO(); // Vacío, va a fallar las validaciones @NotBlank

        ObjectMapper mapper = new ObjectMapper();

        // Act & Assert
        mockMvc.perform(post("/api/v1/mascotas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()); // Esperamos Status 400 provisto por GlobalExceptionHandler
    }
}
