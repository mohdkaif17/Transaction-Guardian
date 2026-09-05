export interface BehaviorProfile {
  averageAmount: number;
  typicalAmountRange: {
    min: number;
    max: number;
  };
  knownRecipients: {
    upiId: string;
    name: string;
    trustLevel: 'HIGH' | 'MEDIUM';
    priorInteractions: number;
  }[];
  normalStartHour: number; // 9 = 9:00 AM
  normalEndHour: number; // 22 = 10:00 PM
  commonCategories: string[];
}

export const mockBehaviorProfile: BehaviorProfile = {
  averageAmount: 1250,
  typicalAmountRange: {
    min: 500,
    max: 1500,
  },
  knownRecipients: [
    { upiId: 'swiggy@icici', name: 'Swiggy', trustLevel: 'HIGH', priorInteractions: 34 },
    { upiId: 'amazonpay@apl', name: 'Amazon', trustLevel: 'HIGH', priorInteractions: 28 },
    { upiId: 'uber.rides@axisbank', name: 'Uber', trustLevel: 'HIGH', priorInteractions: 19 },
    { upiId: 'zomato@hdfcbank', name: 'Zomato', trustLevel: 'HIGH', priorInteractions: 22 },
    { upiId: 'airtelbroadband@airtel', name: 'Airtel Broadband', trustLevel: 'HIGH', priorInteractions: 12 },
    { upiId: 'blinkit@icici', name: 'Blinkit', trustLevel: 'HIGH', priorInteractions: 15 },
    { upiId: 'decathlon@hdfcbank', name: 'Decathlon Sports', trustLevel: 'HIGH', priorInteractions: 6 },
    { upiId: 'apollopharmacy@axisbank', name: 'Apollo Pharmacy', trustLevel: 'HIGH', priorInteractions: 9 },
    { upiId: 'tatapower@billdesk', name: 'Tata Power Electricity', trustLevel: 'HIGH', priorInteractions: 14 },
    { upiId: 'olacabs@icici', name: 'Ola Cabs', trustLevel: 'HIGH', priorInteractions: 11 },
    { upiId: 'bookmyshow@kotak', name: 'BookMyShow', trustLevel: 'HIGH', priorInteractions: 8 },
    { upiId: 'starbucks@hdfcbank', name: 'Starbucks Coffee', trustLevel: 'HIGH', priorInteractions: 14 },
    { upiId: 'myntra@icici', name: 'Myntra Fashion', trustLevel: 'HIGH', priorInteractions: 10 },
    { upiId: 'cultfit@hdfcbank', name: 'Cult.Fit Gym', trustLevel: 'HIGH', priorInteractions: 7 },
    { upiId: 'flipkart@axisbank', name: 'Flipkart', trustLevel: 'HIGH', priorInteractions: 16 },
    { upiId: 'bigbasket@okaxis', name: 'BigBasket', trustLevel: 'HIGH', priorInteractions: 25 },
    { upiId: 'zepto@okaxis', name: 'Zepto', trustLevel: 'HIGH', priorInteractions: 18 },
    { upiId: 'shellpetrol@okaxis', name: 'Shell Petrol', trustLevel: 'HIGH', priorInteractions: 8 },
    { upiId: 'reliancefresh@okaxis', name: 'Reliance Fresh', trustLevel: 'HIGH', priorInteractions: 12 },
    { upiId: 'spotify@okaxis', name: 'Spotify', trustLevel: 'HIGH', priorInteractions: 9 },
    { upiId: 'netflix@okaxis', name: 'Netflix', trustLevel: 'HIGH', priorInteractions: 10 },
    { upiId: 'makemytrip@okaxis', name: 'MakeMyTrip', trustLevel: 'HIGH', priorInteractions: 5 },
    { upiId: 'irctcrail@okaxis', name: 'IRCTC Rail', trustLevel: 'HIGH', priorInteractions: 7 },
    { upiId: 'dunzo@okaxis', name: 'Dunzo', trustLevel: 'HIGH', priorInteractions: 11 },
    { upiId: 'medplus@okaxis', name: 'MedPlus', trustLevel: 'HIGH', priorInteractions: 8 },
  ],
  normalStartHour: 9,
  normalEndHour: 22,
  commonCategories: ['Shopping', 'Food', 'Transport', 'Bills'],
};
