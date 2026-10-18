export const mockSettings = {
  latencyMs: 500,
  shouldFail: false,
  returnEmpty: false,
  bookingConflict: false,
};

export async function simulateRequest(): Promise<void> {
  await new Promise<void>((resolve) =>
    setTimeout(resolve, mockSettings.latencyMs),
  );

  if (mockSettings.shouldFail) {
    throw new Error('Unable to connect. Please try again.');
  }
}
