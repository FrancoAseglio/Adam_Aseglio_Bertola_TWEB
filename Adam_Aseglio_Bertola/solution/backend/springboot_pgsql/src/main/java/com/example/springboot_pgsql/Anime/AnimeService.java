package com.example.springboot_pgsql.Anime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;


/**
 * Service layer for Anime business logic.
 * Handles data operations and business rules for anime series and movies.
 */
@Service
public class AnimeService {
    private final AnimeRepository animeRepository;

    @Autowired
    public AnimeService(AnimeRepository animeRepository) {
        this.animeRepository = animeRepository;
    }

    public List<Anime> getAllAnime(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return animeRepository.findAll(pageable).getContent();
    }

    public Anime getAnimeById(Integer id) {
        return animeRepository.findById(id).orElse(null);
    }

    public List<Anime> searchByTitle(String title) {
        return animeRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Anime> getByGenre(String genre) {
        return animeRepository.findByGenresContainingIgnoreCase(genre);
    }

    public List<Anime> getByType(String type) {
        return animeRepository.findByType(type);
    }

    public List<Anime> getTopAnime(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return animeRepository.findAllByScoreIsNotNullOrderByScoreDesc(pageable);
    }

    public long count() {
        return animeRepository.count();
    }

    public void saveAll(List<Anime> animeList) {
        animeRepository.saveAll(animeList);
    }
}