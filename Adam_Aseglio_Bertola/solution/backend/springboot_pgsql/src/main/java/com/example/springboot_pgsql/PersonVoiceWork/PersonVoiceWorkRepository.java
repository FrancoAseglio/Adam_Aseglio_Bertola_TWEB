package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonVoiceWorkRepository extends JpaRepository<PersonVoiceWork, Integer> {
    
}
