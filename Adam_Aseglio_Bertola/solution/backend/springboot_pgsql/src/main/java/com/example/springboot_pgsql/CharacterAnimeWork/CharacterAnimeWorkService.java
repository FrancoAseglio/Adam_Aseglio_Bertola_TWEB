package com.example.springboot_pgsql.CharacterAnimeWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service layer for CharacterAnimeWork business logic.
 * Handles data operations for character-anime relationships.
 */
@Service
public class CharacterAnimeWorkService {
    private final CharacterAnimeWorkRepository repository;

    @Autowired
    public CharacterAnimeWorkService(CharacterAnimeWorkRepository repository) {
        this.repository = repository;
    }

    public List<CharacterAnimeWork> getCharactersByAnime(Integer animeId) {
        return repository.findByAnimeMalId(animeId);
    }

    public List<CharacterAnimeWork> getAnimeByCharacter(Integer characterId) {
        return repository.findByCharacterMalId(characterId);
    }

    public CharacterAnimeWork save(CharacterAnimeWork work) {
        return repository.save(work);
    }

    public void saveAll(List<CharacterAnimeWork> workList) {
        repository.saveAll(workList);
    }
}