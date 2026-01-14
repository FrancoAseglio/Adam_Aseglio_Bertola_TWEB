package com.example.springboot_pgsql.CharacterAnimeWork;
import jakarta.persistence.*;

@Entity
@Table(name = "character_anime_works")
public class CharacterAnimeWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "character_mal_id")
    private Integer characterMalId;

    @Column(name = "anime_mal_id")
    private Integer animeMalId;

    private String role;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getCharacterMalId() { return characterMalId; }
    public void setCharacterMalId(Integer characterMalId) { this.characterMalId = characterMalId; }

    public Integer getAnimeMalId() { return animeMalId; }
    public void setAnimeMalId(Integer animeMalId) { this.animeMalId = animeMalId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
