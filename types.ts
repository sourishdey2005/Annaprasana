
export interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodScan extends NutritionData {
  id: string;
  timestamp: number;
  imageBase64: string;
}

export enum Tab {
  SCAN = 'scan',
  HISTORY = 'history',
  DASHBOARD = 'dashboard'
}
