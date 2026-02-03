package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for PersonVoiceWork data access.
 * Provides database operations for voice acting assignment entities.
 */
@Repository
public interface PersonVoiceWorkRepository extends JpaRepository<PersonVoiceWork, Integer> {
    
    @Query(value = "SELECT temp.person_mal_id, temp.role, temp.anime_mal_id, temp.character_mal_id, temp.language " +
                   "FROM ( " +
                   "    SELECT DISTINCT ON (pvw.person_mal_id) " +
                   "        pvw.person_mal_id, pvw.role, pvw.anime_mal_id, pvw.character_mal_id, pvw.language, p.favorites " +
                   "    FROM person_voice_works pvw " +
                   "    INNER JOIN person_details p ON pvw.person_mal_id = p.person_mal_id " +
                   "    WHERE pvw.anime_mal_id = :animeId " +
                   ") temp " +
                   "ORDER BY temp.favorites DESC NULLS LAST", nativeQuery = true)
    List<Object[]> findAllPeopleByAnime(@Param("animeId") Integer animeId);
}
