package com.example.springboot_pgsql.Character;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Character data access.
 * Provides database operations for anime character entities.
 */
@Repository
public interface CharacterRepository extends JpaRepository<Character, Integer> {
    List<Character> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT MAX(c.characterMalId) FROM Character c")
    Integer findMaxCharacterId();
}
