package com.example.springboot_pgsql.Anime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;



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

    public Anime getAnimeById(Integer id) {
        return animeRepository.findById(id).orElse(null);
    }

    public List<Anime> searchByTitle(String title, Integer limit) {
        if (limit != null && limit > 0) {
            Pageable pageable = PageRequest.of(0, limit);
            return animeRepository.findByTitleContainingIgnoreCase(title, pageable);
        }
        return animeRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<String> getAllGenres() {
        return Arrays.asList(
            "Action", "Adventure", "Avant Garde", "Award Winning", "Boys Love",
            "Comedy", "Drama", "Ecchi", "Erotica", "Fantasy", "Girls Love",
            "Gourmet", "Hentai", "Horror", "Mystery", "Romance", "Sci-Fi",
            "Slice of Life", "Sports", "Supernatural", "Suspense"
        );
    }

    public List<Anime> getByGenre(String genre, Integer limit) {
        if (limit != null && limit > 0) {
            Pageable pageable = PageRequest.of(0, limit);
            return animeRepository.findByGenresContainingIgnoreCase(genre, pageable);
        }
        return animeRepository.findByGenresContainingIgnoreCase(genre);
    }

    public long count() {
        return animeRepository.count();
    }
}
