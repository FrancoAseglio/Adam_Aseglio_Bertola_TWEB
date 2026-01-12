package com.example.springboot_pgsql;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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

    public List<Anime> searchByTitle(String title) {
        return animeRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Anime> getByGenre(String genre) {
        return animeRepository.findByGenresContainingIgnoreCase(genre);
    }

    public List<Anime> getByType(String type) {
        return animeRepository.findByType(type);
    }

    public long count() {
        return animeRepository.count();
    }

    public void saveAll(List<Anime> animeList) {
        animeRepository.saveAll(animeList);
    }
}