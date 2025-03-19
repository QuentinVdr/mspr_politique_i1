export const politicalColors = {
  extreme_gauche: '#FF5733', // bright red-orange
  gauche: '#FFC300', // golden yellow
  centre: '#36D7B7', // turquoise
  droite: '#3498DB', // bright blue
  extreme_droite: '#9B59B6' // purple
};

export const getColorsByPolitical = (politicalParty: string) =>
  politicalColors[politicalParty as keyof typeof politicalColors] ?? '#000000';
