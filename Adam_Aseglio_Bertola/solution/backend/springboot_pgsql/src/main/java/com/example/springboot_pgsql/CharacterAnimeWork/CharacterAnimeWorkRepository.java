package com.example.springboot_pgsql.CharacterAnimeWork;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for CharacterAnimeWork data access.
 * Provides database operations for character-anime relationship entities.
 */
@Repository
public interface CharacterAnimeWorkRepository extends JpaRepository<CharacterAnimeWork, Long> {
    // Methods for character anime work queries
    List<CharacterAnimeWork> findByAnimeMalId(Integer animeMalId);
    List<CharacterAnimeWork> findByCharacterMalId(Integer characterMalId);
    
}

