/**
 * Character Handler Module
 *
 * Provides functionality for managing characters through the API.
 * Handles adding and removing characters.
 *
 * Dependencies:
 * - api-handlers.js (for api instance and handle function)
 *
 * Exports:
 * - addCharacter: Add a new character
 * - removeCharacter: Remove a character
 */

/**
 * Add a new character to the database
 * Creates a new character entry through the gateway API.
 * Displays success/error messages.
 *
 * @param {string} name - The character name (required)
 * @param {string} image - The character image URL (required)
 * @param {string} about - The character description (required)
 * @returns {Promise<void>}
 *
 * @example
 * // Add a new character
 * await addCharacter('Monkey D. Luffy', 'https://cdn.myanimelist.net/images/characters/9/310307.jpg', 'Luffy is the captain...');
 */
async function addCharacter(name, image, about) {
  // A new character needs at least 'name' and 'about' fileds
  if (!name || typeof name !== 'string' || name.trim() === ''){
    alert('❌ Please enter a character name');
    return;
  }

  if (!about || typeof about !== "string" || about.trim() === "") {
    alert("❌ Please enter a valid character description");
    return;
  }

  try {
    const response = await handle(() =>
      api.post('/characters', {
        name : name.trim(),
        image: image.trim(),
        about: about.trim()
      })
    );

    alert(`✅ Success! Character "${name}" has been added with ID ${response.characterMalId}.`);
    console.log('Character added:', response);
  } catch (error) {
    const errorMsg = typeof error === 'string' ? error.toLowerCase() : String(error).toLowerCase();

    if (errorMsg.includes('already exists') || errorMsg.includes('conflict') || errorMsg.includes('409')) {
      alert(`⚠️ Character "${name}" already exists in the database.`);
    } else if (errorMsg.includes('required') || errorMsg.includes('validation') || errorMsg.includes('400')) {
      alert(`❌ Invalid input. Please ensure all fields (name, image, about) are filled correctly.`);
    } else {
      alert(`❌ Unable to add character. Error: ${error}`);
    }
    console.error('Error adding character:', error);
  }
}

/**
 * Remove a character from the database
 * Deletes a character entry through the gateway API.
 * Displays confirmation message.
 *
 * @param {number} characterId - The character MAL ID to remove
 * @returns {Promise<void>}
 *
 * @example
 * // Remove character with ID 40
 * await removeCharacter(40);
 */
async function removeCharacter(characterId) {
  if (!characterId) {
    alert('❌ Please enter a character ID');
    return;
  }
  if (!Number.isInteger(parseInt(characterId)) || parseInt(characterId) <= 0) {
    alert('❌ Please enter a valid character ID (positive number)');
    return;
  }

  try {
    // Step 1: Check if character exists
    let characterName = null;
    try {
      const characterData = await handle(() => api.get(`/characters/${parseInt(characterId)}`));
      characterName = characterData.name;
    } catch (charError) {
      alert(`❌ Character with ID ${characterId} does not exist.`);
      console.error('Character not found:', charError);
      return;
    }

    // Step 2: Remove the character
    await handle(() =>api.delete(`/characters/${parseInt(characterId)}`));

    alert(`✅ Successfully removed character "${characterName}" (ID: ${characterId})!`);
    console.log(`Character removed: ID ${characterId}`);
  } catch (error) {
    const errorMsg = typeof error === 'string' ? error.toLowerCase() : String(error).toLowerCase();

    if (errorMsg.includes('forbidden') || errorMsg.includes('403') || errorMsg.includes('cannot remove original')) {
      alert(`🚫 Cannot remove this character!\nOnly custom characters (ID ≥ 282285) can be deleted.\nOriginal database characters are protected.`);
    } else if (errorMsg.includes('not found') || errorMsg.includes('404')) {
      alert(`❌ Character with ID ${characterId} was not found.`);
    } else {
      alert(`❌ Unable to remove character. Error: ${error}`);
    }
    console.error('Error removing character:', error);
  }
}
