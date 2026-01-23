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

    public Character saveCharacter(Character character) {
        return characterRepository.save(character);
    }

    public void saveAll(List<Character> characters) {
        characterRepository.saveAll(characters);
    }

    public void deleteCharacter(Integer id) {
        characterRepository.deleteById(id);
    }
    

    /**
     * Add a new character to the database.
     * 
     * @param name Character name (required)
     * @param image Character image URL (required)
     * @param about Character description (required)
     * @return The created Character entity
     * @throws ResponseStatusException if validation fails or character already exists
     */
    public Character addCharacter(String name, String image, String about) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Character name is required");
        }
        if (image == null || image.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Character image URL is required");
        }
        if (about == null || about.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Character about/description is required");
        }
        
        List<Character> existingChars = characterRepository.findByNameContainingIgnoreCase(name.trim());
        if (!existingChars.isEmpty()) {
            for (Character existing : existingChars) {
                if (existing.getName().equalsIgnoreCase(name.trim())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, 
                        "Character with name '" + name + "' already exists");
                }
            }
        }
        
        Character character = new Character();
        
        // Get next available ID
        Integer maxId = characterRepository.findMaxCharacterId();
        System.out.println("DEBUG - MAX ID from database: " + maxId);
        Integer nextId = (maxId != null) ? maxId + 1 : 1;
        System.out.println("DEBUG - Next ID to use: " + nextId);
        character.setCharacterMalId(nextId);
        
        character.setName(name.trim());
        character.setImageUrl(image.trim());
        character.setAbout(about.trim());
        character.setFavorites(0);
        
        return characterRepository.save(character);
    }
    
   /**
     * Remove a character from the database.
     * Only allows removal of characters with ID >= 282285 (custom added characters).
     * 
     * @param characterId The character MAL ID
     * @throws ResponseStatusException if character not found or ID is below minimum
     */
    public void removeCharacter(Integer characterId) {
        // Prevent deletion of original characters (IDs < 282285)
        if (characterId < 282285) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "Cannot remove original characters (ID < 282285). Only custom added characters can be deleted.");
        }
        
        Character character = characterRepository.findById(characterId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                "Character with ID " + characterId + " not found"));
        
        characterRepository.delete(character);
    }
}    