type ConfettiOptions = Record<string, unknown>;

function disabledConfetti(_options?: ConfettiOptions) {
  return Promise.resolve(null);
}

export default disabledConfetti;
