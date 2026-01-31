package com.example.springboot_pgsql.Person;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entity class representing a person (voice actor, staff, etc.).
 * Maps to the 'person_details' table in the database.
 */
@Entity
@Table(name = "person_details")
public class Person {

    @Id
    @Column(name = "person_mal_id")
    @JsonProperty("person_mal_id")
    private Integer personMalId;

    @Column(name = "given_name")
    @JsonProperty("given_name")
    private String givenName;

    @Column(name = "family_name")
    @JsonProperty("family_name")
    private String familyName;

    @Column(name = "given_name_native")
    @JsonProperty("given_name_native")
    private String givenNameNative;

    @Column(name = "family_name_native")
    @JsonProperty("family_name_native")
    private String familyNameNative;

    private LocalDate birthday;

    @Column(length = 5000)
    private String about;

    private Integer favorites;

    @Column(name = "image_url")
    @JsonProperty("image_url")
    private String imageUrl;

    private String url;

    @Column(name = "relevant_location")
    @JsonProperty("relevant_location")
    private String relevantLocation;

    @Column(name = "name")
    private String name;

    @Column(name = "alternate_names")
    @JsonProperty("alternate_names")
    private String alternateNames;

    public Integer getPersonMalId() { return personMalId; }
    public void setPersonMalId(Integer personMalId) { this.personMalId = personMalId; }

    public String getGivenName() { return givenName; }
    public void setGivenName(String givenName) { this.givenName = givenName; }

    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }

    public String getGivenNameNative() { return givenNameNative; }
    public void setGivenNameNative(String givenNameNative) { this.givenNameNative = givenNameNative; }

    public String getFamilyNameNative() { return familyNameNative; }
    public void setFamilyNameNative(String familyNameNative) { this.familyNameNative = familyNameNative; }

    public LocalDate getBirthday() { return birthday; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public Integer getFavorites() { return favorites; }
    public void setFavorites(Integer favorites) { this.favorites = favorites; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getRelevantLocation() { return relevantLocation; }
    public void setRelevantLocation(String relevantLocation) { this.relevantLocation = relevantLocation; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAlternateNames() { return alternateNames; }
    public void setAlternateNames(String alternateNames) { this.alternateNames = alternateNames; }
}