package com.example.springboot_pgsql.Character;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for Character business logic.
 * Handles data operations and business rules for anime characters.
 */
@Service
public class CharacterService {
    private final CharacterRepository characterRepository;

    @Autowired
    public CharacterService(CharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    public Page<Character> getAllCharacters(Pageable pageable) {
        return characterRepository.findAll(pageable);
    }

    public Optional<Character> getCharacterById(Integer id) {
        return characterRepository.findById(id);
    }

    public List<Character> searchByName(String name) {
        return characterRepository.findByNameContainingIgnoreCase(name);
    }

    public void saveAll(List<Character> characters) {
        characterRepository.saveAll(characters);
    }

}
    