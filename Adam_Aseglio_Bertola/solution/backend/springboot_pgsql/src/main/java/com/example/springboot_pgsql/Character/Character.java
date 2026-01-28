package com.example.springboot_pgsql.Character;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

/**
 * Entity class representing an anime character.
 * Maps to the 'characters' table in the database.
 */
@Entity
@Table(name = "characters")
public class Character {
    @Id
    @Column(name = "character_mal_id")
    @JsonProperty("character_mal_id")
    private Integer characterMalId;
    
    private String name;
    
    @Column(name = "name_kanji")
    @JsonProperty("name_kanji")
    private String nameKanji;
    
    private String nicknames;
    private String about;
    private Integer favorites;
    
    @Column(name = "image")
    @JsonProperty("image_url")
    private String imageUrl;

    public Integer getCharacterMalId() { return characterMalId; }
    public void setCharacterMalId(Integer characterMalId) { this.characterMalId = characterMalId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameKanji() { return nameKanji; }
    public void setNameKanji(String nameKanji) { this.nameKanji = nameKanji; }

    public String getNicknames() { return nicknames; }
    public void setNicknames(String nicknames) { this.nicknames = nicknames; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public Integer getFavorites() { return favorites; }
    public void setFavorites(Integer favorites) { this.favorites = favorites; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
