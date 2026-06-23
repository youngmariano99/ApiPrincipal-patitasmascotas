package com.patitas.alerta.repositories;

import com.patitas.alerta.entities.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, UUID> {
    
    // Spring Data Query Method
    List<Mascota> findByUsuarioId(UUID usuarioId);

    // JPQL Custom Query (Requisito de Ejercicio)
    @Query("SELECT m FROM Mascota m WHERE m.usuario.id = :duenoId AND m.estadoAdopcion = :estado")
    List<Mascota> buscarPorDuenoYEstado(@Param("duenoId") UUID duenoId, @Param("estado") String estado);
}
