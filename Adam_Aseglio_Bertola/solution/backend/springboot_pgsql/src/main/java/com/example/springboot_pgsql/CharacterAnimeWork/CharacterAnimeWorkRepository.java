package com.example.springboot_pgsql.CharacterAnimeWork;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CharacterAnimeWorkRepository extends JpaRepository<CharacterAnimeWork, Long> {
    List<CharacterAnimeWork> findByAnimeMalId(Integer animeMalId);
    List<CharacterAnimeWork> findByCharacterMalId(Integer characterMalId);
    
}

