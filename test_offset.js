const getSantiagoDate = (Y, Mo, D, H, Mi, S, Ms = 0) => {
  const dateUtc = new Date(Date.UTC(Y, Mo, D, H, Mi, S, Ms));
  const locString = dateUtc.toLocaleString("en-US", { timeZone: "America/Santiago" });
  const locDate = new Date(locString);
  const utcDate = new Date(dateUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMinutes = (locDate.getTime() - utcDate.getTime()) / (60 * 1000);
  return new Date(dateUtc.getTime() - offsetMinutes * 60 * 1000);
};

console.log("Original 8:00 in Santiago:", getSantiagoDate(2026, 5, 9, 8, 0, 0).toISOString());
