package com.patitas.alerta.repositories;

import com.patitas.alerta.entities.LibretaSanitaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LibretaSanitariaRepository extends JpaRepository<LibretaSanitaria, UUID> {
    Optional<LibretaSanitaria> findByCodigoQr(String codigoQr);
}
