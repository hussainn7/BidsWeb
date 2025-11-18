import { useState, useEffect } from 'react';

const BONUS_PER_CLICK = 40;
const BONUS_EXPIRY_DAYS = 30;

interface PriceVisibilityState {
  clickCount: number;
  bonusRubles: number;
  isPriceVisible: boolean;
  showBuyButton: boolean;
  lastClickTimestamp: number | null;
  showPriceUntil: number | null;
  showBuyButtonUntil: number | null;
  bonusExpiryDate: Date | null;
}

export const usePriceVisibility = (productId: string) => {
  const [state, setState] = useState<PriceVisibilityState>(() => {
    const saved = localStorage.getItem(`priceVisibility_${productId}`);
    return saved ? JSON.parse(saved) : {
      clickCount: 0,
      bonusRubles: 0,
      isPriceVisible: false,
      showBuyButton: false,
      lastClickTimestamp: null,
      showPriceUntil: null,
      showBuyButtonUntil: null,
      bonusExpiryDate: null
    };
  });

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(`priceVisibility_${productId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      
      // Check if price visibility has expired
      if (parsed.showPriceUntil && parsed.showPriceUntil < now) {
        setState(prev => ({
          ...prev,
          isPriceVisible: false,
          showPriceUntil: null
        }));
      }

      // Check if buy button visibility has expired
      if (parsed.showBuyButtonUntil && parsed.showBuyButtonUntil < now) {
        setState(prev => ({
          ...prev,
          showBuyButton: false,
          showBuyButtonUntil: null
        }));
      }
    }
  }, [productId]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`priceVisibility_${productId}`, JSON.stringify(state));
  }, [productId, state]);

  const handlePriceClick = () => {
    const now = Date.now();
    const newClickCount = state.clickCount + 1;
    let showPriceUntil = state.showPriceUntil;
    let showBuyButtonUntil = state.showBuyButtonUntil;
    let bonusExpiryDate = state.bonusExpiryDate;

    // Set price visibility based on click count
    if (newClickCount === 1) {
      showPriceUntil = now + 3600000; // 1 hour
      showBuyButtonUntil = now + 3600000;
    } else if (newClickCount === 2) {
      showPriceUntil = now + 86400000; // 24 hours
      showBuyButtonUntil = now + 86400000;
    } else if (newClickCount >= 3) {
      showPriceUntil = null; // Permanent
      showBuyButtonUntil = null; // Permanent
    }

    // Set bonus expiry date on first click
    if (newClickCount === 1) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + BONUS_EXPIRY_DAYS);
      bonusExpiryDate = expiryDate;
    }

    setState({
      clickCount: newClickCount,
      bonusRubles: newClickCount * BONUS_PER_CLICK,
      isPriceVisible: true,
      showBuyButton: true,
      lastClickTimestamp: now,
      showPriceUntil,
      showBuyButtonUntil,
      bonusExpiryDate
    });
  };

  const applyBonus = (price: number, minPrice: number) => {
    const maxDiscount = price - minPrice;
    const discount = Math.min(state.bonusRubles, maxDiscount);
    return {
      finalPrice: price - discount,
      discountApplied: discount
    };
  };

  return {
    ...state,
    handlePriceClick,
    applyBonus,
    bonusExpiryDays: BONUS_EXPIRY_DAYS
  };
};
