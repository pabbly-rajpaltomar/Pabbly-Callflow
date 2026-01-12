// Avatar utility functions for generating consistent colors and initials

// Vibrant color palette for avatars
const avatarColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Purple
  '#85C1E9', // Light Blue
  '#F8B500', // Orange
  '#00CED1', // Dark Cyan
  '#FF69B4', // Hot Pink
  '#20B2AA', // Light Sea Green
  '#9370DB', // Medium Purple
  '#3CB371', // Medium Sea Green
  '#FF7F50', // Coral
  '#6495ED', // Cornflower Blue
  '#DC143C', // Crimson
  '#00FA9A', // Medium Spring Green
];

// Generate a consistent color based on the name
export const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];

  // Create a hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to pick a color
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

// Get initials from name (up to 2 characters)
export const getInitials = (name) => {
  if (!name) return '?';

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Generate avatar style object
export const getAvatarStyle = (name, size = 40) => {
  const bgColor = getAvatarColor(name);

  return {
    width: size,
    height: size,
    bgcolor: bgColor,
    color: '#fff',
    fontWeight: 600,
    fontSize: size * 0.4,
    textTransform: 'uppercase',
  };
};

export default {
  getAvatarColor,
  getInitials,
  getAvatarStyle,
};
