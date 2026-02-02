package com.example.springboot_pgsql.Character;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Character data access.
 * Provides database operations for anime character entities.
 */
@Repository
public interface CharacterRepository extends JpaRepository<Character, Integer> {
    List<Character> findByNameContainingIgnoreCaseOrderByFavoritesDesc(String name);
    
    @Query("SELECT MAX(c.characterMalId) FROM Character c")
    Integer findMaxCharacterId();
    
    @Query(value = "SELECT c.character_mal_id, c.name, c.name_kanji, c.nicknames, c.about, " +
           "c.favorites, c.image, " +
           "CASE WHEN :role IS NOT NULL THEN :role ELSE MAX(caw.role) END as role " +
           "FROM characters c " +
           "JOIN character_anime_works caw ON c.character_mal_id = caw.character_mal_id " +
           "WHERE (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:role IS NULL OR LOWER(caw.role) = LOWER(:role)) " +
           "AND (:minFavorites IS NULL OR c.favorites >= :minFavorites) " +
           "GROUP BY c.character_mal_id, c.name, c.name_kanji, c.nicknames, c.about, c.favorites, c.image " +
           "ORDER BY c.favorites DESC",
           nativeQuery = true)
    List<Character> searchWithFilters(@Param("name") String name,
                                      @Param("role") String role,
                                      @Param("minFavorites") Integer minFavorites);
}
