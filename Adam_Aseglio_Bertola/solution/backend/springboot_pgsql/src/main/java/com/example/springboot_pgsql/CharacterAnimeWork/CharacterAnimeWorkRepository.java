package com.example.springboot_pgsql.CharacterAnimeWork;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for CharacterAnimeWork data access.
 * Provides database operations for character-anime relationship entities.
 */
@Repository
public interface CharacterAnimeWorkRepository extends JpaRepository<CharacterAnimeWork, Long> {
    List<CharacterAnimeWork> findByAnimeMalId(Integer animeMalId);
    List<CharacterAnimeWork> findByCharacterMalId(Integer characterMalId);
    
    @Query(value = "SELECT caw.* FROM character_anime_works caw " +
                   "INNER JOIN characters c ON caw.character_mal_id = c.character_mal_id " +
                   "WHERE caw.anime_mal_id = :animeId " +
                   "ORDER BY c.favorites DESC NULLS LAST " +
                   "LIMIT 20", nativeQuery = true)
    List<CharacterAnimeWork> findTop20CharactersByAnimeOrderByFavorites(@Param("animeId") Integer animeId);
    
}

