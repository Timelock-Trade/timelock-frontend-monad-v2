export const formatBasic = (input: string | number): string => {
  const str = input.toString(10);
  const [whole, decimal] = str.split(".");

  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!decimal) return formattedWhole;

  return `${formattedWhole}.${decimal}`;
};

export const formatCondensed = (input: string | number, decimals = 2): string => {
  const str = input.toString(10);
  const [whole, decimal] = str.split(".");

  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!decimal) return formattedWhole;

  const leadingZeroMatch = decimal.match(/^(0{3,})/);

  if (leadingZeroMatch) {
    const zeroCount = leadingZeroMatch[1].length;
    const subscript = toSubscript(zeroCount.toString());
    const remaining = decimal.slice(zeroCount);

    const twoDigits = remaining.slice(0, decimals);
    return `${formattedWhole}.0${subscript}${twoDigits}`;
  } else {
    // No subscript needed, find first 2 significant digits
    const nonZeroStart = decimal.search(/[1-9]/); // Find first non-zero digit

    if (nonZeroStart === -1) {
      return formattedWhole; // All zeros
    }
    const significantPart = decimal.slice(nonZeroStart);
    const twoDigits = significantPart.slice(0, decimals);
    const leadingZeros = decimal.slice(0, nonZeroStart);

    return `${formattedWhole}.${leadingZeros}${twoDigits}`;
  }
};

const toSubscript = (input: string) => {
  return input.replace(/[0-9]/g, (m) => "₀₁₂₃₄₅₆₇₈₉"[+m]);
};

export const formatUSD = (value: string | number): string => {
  return '$' + formatCondensed(value);
};
