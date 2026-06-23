package com.patitas.alerta.controllers;

import com.patitas.alerta.dtos.MascotaRequestDTO;
import com.patitas.alerta.dtos.MascotaResponseDTO;
import com.patitas.alerta.services.MascotaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/mascotas")
@Tag(name = "API Principal - Mascotas", description = "Operaciones seguras del Ecosistema de Mascotas (Requieren JWT)")
public class MascotaController {

    @Autowired
    private MascotaService mascotaService;

    @GetMapping
    @Operation(summary = "Obtener Mascotas", description = "Retorna todas las mascotas. Permite filtrar opcionalmente por dueño enviando el Query Param ?duenoId=...")
    public ResponseEntity<List<MascotaResponseDTO>> obtenerMascotas(
            @RequestParam(required = false) UUID duenoId) {
        
        if (duenoId != null) {
            return ResponseEntity.ok(mascotaService.buscarPorDueno(duenoId));
        }
        return ResponseEntity.ok(mascotaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Mascota por ID", description = "Retorna los detalles de una mascota específica.")
    public ResponseEntity<MascotaResponseDTO> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(mascotaService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Registrar Mascota", description = "Crea una nueva mascota. El Body es validado automáticamente.")
    public ResponseEntity<MascotaResponseDTO> crearMascota(@Valid @RequestBody MascotaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mascotaService.crearMascota(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Mascota", description = "Actualiza todos los datos de una mascota.")
    public ResponseEntity<MascotaResponseDTO> actualizarMascota(
            @PathVariable UUID id, 
            @Valid @RequestBody MascotaRequestDTO dto) {
        return ResponseEntity.ok(mascotaService.actualizarMascota(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Mascota", description = "Realiza un Soft Delete (borrado lógico) de la mascota indicada mediante su ID. El registro permanecerá en la base de datos pero será invisible para las consultas.")
    public ResponseEntity<Void> eliminarMascota(@PathVariable UUID id) {
        mascotaService.eliminarMascota(id);
        return ResponseEntity.noContent().build();
    }
}
