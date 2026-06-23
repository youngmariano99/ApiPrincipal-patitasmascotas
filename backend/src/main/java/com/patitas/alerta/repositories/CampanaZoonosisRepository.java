package com.patitas.alerta.repositories;

import com.patitas.alerta.entities.CampanaZoonosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface CampanaZoonosisRepository extends JpaRepository<CampanaZoonosis, UUID> {
}
