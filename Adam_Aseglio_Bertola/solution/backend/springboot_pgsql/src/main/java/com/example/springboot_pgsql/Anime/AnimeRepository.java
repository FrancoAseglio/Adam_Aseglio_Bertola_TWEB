package com.example.springboot_pgsql.Anime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimeRepository extends JpaRepository<Anime, Integer> {
    List<Anime> findByTitleContainingIgnoreCase(String title);
    List<Anime> findByGenresContainingIgnoreCase(String genre);
    List<Anime> findByType(String type);
    
}
