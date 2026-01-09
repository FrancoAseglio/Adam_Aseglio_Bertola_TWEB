package com.example.springboot_pgsql;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entity class representing an anime series/movie.
 * Maps to the 'details' table in the database.
 * Contains comprehensive information about anime including title, episodes, ratings, and more.
 */
@Entity
@Table(name = "details")
public class Anime {
    @Id
    @Column(name = "mal_id")
    @JsonProperty("mal_id")
    private Integer malId;

    private String title;

    @Column(name = "title_english")
    @JsonProperty("title_english")
    private String titleEnglish;

    @Column(name = "title_japanese")
    @JsonProperty("title_japanese")
    private String titleJapanese;

    private String type;
    private String source;
    private Integer episodes;
    private String status;

    @Column(name = "aired_from")
    @JsonProperty("aired_from")
    private LocalDate airedFrom;

    @Column(name = "aired_to")
    @JsonProperty("aired_to")
    private LocalDate airedTo;

    private String duration;
    private String rating;
    private Double score;

    @Column(name = "scored_by")
    @JsonProperty("scored_by")
    private Integer scoredBy;

    private Integer rank;
    private Integer popularity;
    private Integer members;
    private Integer favorites;

    @Column(length = 5000)
    private String synopsis;

    private String background;
    private String season;

    // 'year' is a reserved word in some SQL dialects (H2). Map it to a safe column name.
    @Column(name = "release_year")
    private Integer year;

    @Column(name = "broadcast_day")
    @JsonProperty("broadcast_day")
    private String broadcastDay;

    @Column(name = "broadcast_time")
    @JsonProperty("broadcast_time")
    private String broadcastTime;

    private String producers;
    private String licensors;
    private String studios;
    private String genres;
    private String themes;
    private String demographics;

    @Column(name = "image_url")
    @JsonProperty("image_url")
    private String imageUrl;

    // Getters and Setters
    public Integer getMalId() { return malId; }
    public void setMalId(Integer malId) { this.malId = malId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTitleEnglish() { return titleEnglish; }
    public void setTitleEnglish(String titleEnglish) { this.titleEnglish = titleEnglish; }

    public String getTitleJapanese() { return titleJapanese; }
    public void setTitleJapanese(String titleJapanese) { this.titleJapanese = titleJapanese; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Integer getEpisodes() { return episodes; }
    public void setEpisodes(Integer episodes) { this.episodes = episodes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getAiredFrom() { return airedFrom; }
    public void setAiredFrom(LocalDate airedFrom) { this.airedFrom = airedFrom; }

    public LocalDate getAiredTo() { return airedTo; }
    public void setAiredTo(LocalDate airedTo) { this.airedTo = airedTo; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public Integer getScoredBy() { return scoredBy; }
    public void setScoredBy(Integer scoredBy) { this.scoredBy = scoredBy; }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }

    public Integer getPopularity() { return popularity; }
    public void setPopularity(Integer popularity) { this.popularity = popularity; }

    public Integer getMembers() { return members; }
    public void setMembers(Integer members) { this.members = members; }

    public Integer getFavorites() { return favorites; }
    public void setFavorites(Integer favorites) { this.favorites = favorites; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getBackground() { return background; }
    public void setBackground(String background) { this.background = background; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getBroadcastDay() { return broadcastDay; }
    public void setBroadcastDay(String broadcastDay) { this.broadcastDay = broadcastDay; }

    public String getBroadcastTime() { return broadcastTime; }
    public void setBroadcastTime(String broadcastTime) { this.broadcastTime = broadcastTime; }

    public String getProducers() { return producers; }
    public void setProducers(String producers) { this.producers = producers; }

    public String getLicensors() { return licensors; }
    public void setLicensors(String licensors) { this.licensors = licensors; }

    public String getStudios() { return studios; }
    public void setStudios(String studios) { this.studios = studios; }

    public String getGenres() { return genres; }
    public void setGenres(String genres) { this.genres = genres; }

    public String getThemes() { return themes; }
    public void setThemes(String themes) { this.themes = themes; }

    public String getDemographics() { return demographics; }
    public void setDemographics(String demographics) { this.demographics = demographics; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
