package com.example.springboot_pgsql.Anime;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


/**
 * Repository interface for Anime data access using Spring Data JPA.
 * Matches the style of other repositories in the project (e.g., CharacterRepository).
 */
@Repository
public interface AnimeRepository extends JpaRepository<Anime, Integer> {
    List<Anime> findByTitleContainingIgnoreCase(String title);
    List<Anime> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    List<Anime> findByGenresContainingIgnoreCase(String genre);
    List<Anime> findByGenresContainingIgnoreCase(String genre, Pageable pageable);
    List<Anime> findByType(String type);
    List<Anime> findAllByScoreIsNotNullOrderByScoreDesc(Pageable pageable);
    List<Anime> findAllByMembersIsNotNullOrderByMembersDesc(Pageable pageable);
}

