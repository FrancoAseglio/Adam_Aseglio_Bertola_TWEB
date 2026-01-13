package com.example.springboot_pgsql.PersonVoiceWork;
import jakarta.persistence.*;


@Entity
@Table(name = "person_voice_works")
public class PersonVoiceWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "person_mal_id")
    private Integer personMalId;

    @Column(name = "anime_mal_id")
    private Integer animeMalId;

    @Column(name = "character_mal_id")
    private Integer characterMalId;

    private String role;
    private String language;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getPersonMalId() { return personMalId; }
    public void setPersonMalId(Integer personMalId) { this.personMalId = personMalId; }

    public Integer getAnimeMalId() { return animeMalId; }
    public void setAnimeMalId(Integer animeMalId) { this.animeMalId = animeMalId; }

    public Integer getCharacterMalId() { return characterMalId; }
    public void setCharacterMalId(Integer characterMalId) { this.characterMalId = characterMalId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
