package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for PersonVoiceWork data access.
 * Provides database operations for voice acting assignment entities.
 */
@Repository
public interface PersonVoiceWorkRepository extends JpaRepository<PersonVoiceWork, Integer> {
    
}
