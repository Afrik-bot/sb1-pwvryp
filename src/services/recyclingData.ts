interface RecyclingInfo {
  recyclable: boolean;
  instructions: string;
  materialType: string;
}

const recyclingDatabase: Record<string, RecyclingInfo> = {
  'bottle': {
    recyclable: true,
    materialType: 'plastic',
    instructions: 'Remove cap, rinse, and place in recycling bin. Check bottom for recycling number.'
  },
  'cup': {
    recyclable: true,
    materialType: 'plastic/paper',
    instructions: 'If plastic, rinse and recycle. If paper-based, check for plastic lining - coated cups may not be recyclable.'
  },
  'can': {
    recyclable: true,
    materialType: 'metal',
    instructions: 'Rinse thoroughly. Both aluminum and steel cans are widely recyclable.'
  },
  'paper': {
    recyclable: true,
    materialType: 'paper',
    instructions: 'Keep dry and clean. Remove any plastic windows or metal fasteners.'
  },
  'cardboard': {
    recyclable: true,
    materialType: 'paper',
    instructions: 'Break down boxes, remove tape and staples. Keep dry and clean.'
  },
  'glass': {
    recyclable: true,
    materialType: 'glass',
    instructions: 'Rinse thoroughly. Remove lids and caps. Sort by color if required in your area.'
  },
  'plastic bag': {
    recyclable: false,
    materialType: 'plastic',
    instructions: 'Most curbside programs don\'t accept plastic bags. Return to grocery stores for specialized recycling.'
  }
};

export function getRecyclingInstructions(item: string): RecyclingInfo {
  // Normalize the item name
  const normalizedItem = item.toLowerCase();
  
  // Check for exact matches
  if (recyclingDatabase[normalizedItem]) {
    return recyclingDatabase[normalizedItem];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(recyclingDatabase)) {
    if (normalizedItem.includes(key)) {
      return value;
    }
  }
  
  // Default response for unknown items
  return {
    recyclable: false,
    materialType: 'unknown',
    instructions: 'Unable to determine recycling status. Please check your local recycling guidelines or contact your waste management provider.'
  };
}