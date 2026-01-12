# ===========================================================================
# MongoDB Anime Service - cURL Tests
# Just copy-paste these commands one by one
# ===========================================================================
#                               PROFILES
# ===========================================================================
# Get user profile with stats
curl http://localhost:3002/api/profiles/CKK2/stats | jq
curl http://localhost:3002/api/profiles/potatoaris/stats | jq
curl http://localhost:3002/api/profiles/Folktal3wtb/stats | jq
# Non-existent user (expect 404)
curl http://localhost:3002/api/profiles/non_existent_user/stats | jq
# ===========================================================================
#                                RATINGS
# ===========================================================================
# Get all ratings for user
curl http://localhost:3002/api/ratings/CKK2 | jq
curl http://localhost:3002/api/ratings/potatoaris | jq
curl http://localhost:3002/api/ratings/Folktal3wtb | jq
# GET "no-ratings" and "non-existent" user
curl http://localhost:3002/api/ratings/non_existent_user | jq
# ===========================================================================
#                             RECOMMENDATIONS
# ===========================================================================
# Get recommendations (Full Metal Alchemist)
curl http://localhost:3002/api/recommendations/3269 | jq
# No recommendations available
curl http://localhost:3002/api/recommendations/99999 | jq
# Invalid MAL ID (expect 400)
curl http://localhost:3002/api/recommendations/invalid | jq
# ===========================================================================
#                                 STATS
# ===========================================================================
# Global statistics
curl http://localhost:3002/api/stats/global | jq
# User statistics
curl http://localhost:3002/api/stats/user/CKK2 | jq
# Non-existent user (expect 404)
curl http://localhost:3002/api/stats/user/non_existent_user | jq
# Anime statistics (One Piece)
curl http://localhost:3002/api/stats/anime/21 | jq
# Non-existent anime (expect 404)
curl http://localhost:3002/api/stats/anime/99999999 | jq

