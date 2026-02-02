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
    
    @Query("SELECT DISTINCT c FROM Character c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY c.favorites DESC")
    List<Character> findByNameContainingIgnoreCaseOrderByFavoritesDesc(@Param("name") String name);
    
    @Query("SELECT MAX(c.characterMalId) FROM Character c")
    Integer findMaxCharacterId();
    
    @Query(value = "SELECT DISTINCT c.character_mal_id, c.name, c.name_kanji, c.nicknames, c.about, c.favorites, c.image, c.url " +
           "FROM characters c " +
           "WHERE (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.nicknames) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:minFavorites IS NULL OR c.favorites >= :minFavorites) " +
           "AND (:role IS NULL OR EXISTS ( " +
           "    SELECT 1 FROM character_anime_works caw " +
           "    WHERE caw.character_mal_id = c.character_mal_id " +
           "    AND LOWER(caw.role) = LOWER(:role) " +
           ")) " +
           "ORDER BY c.favorites DESC " +
           "LIMIT CASE WHEN :limit IS NULL THEN 99999 ELSE :limit END",
           nativeQuery = true)
    List<Character> searchWithFilters(@Param("name") String name,
                                      @Param("role") String role,
                                      @Param("minFavorites") Integer minFavorites,
                                      @Param("limit") Integer limit);
}
